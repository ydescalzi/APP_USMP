const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  storage: multer.memoryStorage()
});

app.use(express.json());
app.use(cors());

/* =========================
   LOG REQUESTS
========================= */
app.use((req, res, next) => {
  console.log("=================================");
  console.log("REQUEST:", req.method, req.url);
  console.log("TIME:", new Date().toISOString());
  console.log("=================================");
  next();
});

/* =========================
   CONEXIÓN BD
========================= */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});

/* =========================
   TEST BD
========================= */
app.get('/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error conectando a BD' });
  }
});

/* =========================
    LOGIN UNIVERSAL
========================= */

app.post('/login', async (req, res) => {

  const { dni, email } = req.body;

  try {

    /* ===================== BUSCAR ESTUDIANTE ===================== */

    const [estudiante] = await pool.query(`
      SELECT 
        e.CODIGOSAP,
        e.NOMBRES,
        e.APELLIDOPATERNO,
        e.APELLIDOMATERNO,
        d.NUMERO AS DNI,
        em.EMAIL
      FROM estudiante e
      INNER JOIN documentoidentidad d 
        ON e.CODIGOSAP = d.CODIGOSAP
      INNER JOIN email em 
        ON e.CODIGOSAP = em.CODIGOSAP
      WHERE d.NUMERO = ? 
      AND em.EMAIL = ?
      AND em.VIGENCIA = 1
      LIMIT 1
    `, [dni, email]);

    if (estudiante.length) {

      const user = estudiante[0];

      const token = jwt.sign(
        { codigosap: user.CODIGOSAP, tipo: 'estudiante' },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        success: true,
        tipo: 'estudiante',
        token,
        user
      });

    }

    /* ===================== BUSCAR DOCENTE ===================== */

    const [docente] = await pool.query(`
      SELECT 
        p.CODIGOSAP,
        p.NOMBRES,
        p.APELLIDOPATERNO,
        p.APELLIDOMATERNO,
        p.DNI,
        em.EMAIL
      FROM persona p
      JOIN email em 
        ON p.CODIGOSAP = em.CODIGOSAP
      WHERE p.DNI = ?
      AND em.EMAIL = ?
      LIMIT 1
    `, [dni.trim(), email.trim()]);

    if (docente.length) {

      const user = docente[0];

      const token = jwt.sign(
        { codigosap: user.CODIGOSAP, tipo: 'docente' },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        success: true,
        tipo: 'docente',
        token,
        user
      });

    }

    return res.status(401).json({
      success: false,
      message: 'Credenciales incorrectas'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });

  }

});

/* =========================
   LOGIN UNIVERSAL FACIAL
========================= */

app.post('/login-face', upload.single('file'), async (req, res) => {

  console.log("======== LOGIN FACE ========");

  if (!req.file) {
    return res.status(400).json({
      success:false,
      message:"No se recibió imagen"
    });
  }

  try {

    console.log("Archivo recibido:", req.file.originalname);
    console.log("Tipo:", req.file.mimetype);
    console.log("Tamaño:", req.file.size);

    if (!req.file.buffer || req.file.buffer.length === 0) {

      return res.status(400).json({
        success:false,
        message:"Imagen inválida"
      });

    }

    const FormData = require('form-data');
    const formData = new FormData();

    formData.append("file", req.file.buffer, {
      filename: "face.jpg",
      contentType: "image/jpeg"
    });

    console.log("Enviando a API facial...");

    const faceResponse = await axios.post(
      "http://127.0.0.1:8000/login-face",
      formData,
      {
        headers: formData.getHeaders(),
        timeout:15000
      }
    );

    const data = faceResponse.data;

    console.log("Respuesta IA:", data);

    if (!data || data.login !== true) {

      return res.status(401).json({
        success:false,
        message:"Rostro no reconocido",
        distancia:data.distancia
      });

    }

    const codigosap = data.codigosap;

    console.log("Usuario reconocido:", codigosap);

    // =========================
    // BUSCAR ESTUDIANTE
    // =========================

    const [estudiante] = await pool.query(`
      SELECT 
        e.CODIGOSAP,
        e.NOMBRES,
        e.APELLIDOPATERNO,
        e.APELLIDOMATERNO,
        d.NUMERO AS DNI,
        em.EMAIL
      FROM estudiante e
      JOIN documentoidentidad d
        ON e.CODIGOSAP = d.CODIGOSAP
      JOIN email em
        ON e.CODIGOSAP = em.CODIGOSAP
      WHERE e.CODIGOSAP = ?
      LIMIT 1
    `, [codigosap]);

    if (estudiante.length) {

      const user = estudiante[0];

      const token = jwt.sign(
        { codigosap:user.CODIGOSAP, tipo:'estudiante' },
        process.env.JWT_SECRET,
        { expiresIn:'8h' }
      );

      return res.json({
        success:true,
        tipo:'estudiante',
        token,
        user
      });

    }

    // =========================
    // BUSCAR DOCENTE
    // =========================

    const [docente] = await pool.query(`
      SELECT 
        p.CODIGOSAP,
        p.NOMBRES,
        p.APELLIDOPATERNO,
        p.APELLIDOMATERNO,
        p.DNI,
        em.EMAIL
      FROM persona p
      JOIN email em 
        ON p.CODIGOSAP = em.CODIGOSAP
      WHERE p.CODIGOSAP = ?
      LIMIT 1
    `, [codigosap]);

    if (docente.length) {

      const user = docente[0];

      const token = jwt.sign(
        { codigosap:user.CODIGOSAP, tipo:'docente' },
        process.env.JWT_SECRET,
        { expiresIn:'8h' }
      );

      return res.json({
        success:true,
        tipo:'docente',
        token,
        user
      });

    }

    return res.status(404).json({
      success:false,
      message:"Usuario no encontrado"
    });

  } catch(error){

    console.error("ERROR:", error.message);

    if (error.response) {
      console.error("API facial respondió:", error.response.data);
    }

    return res.status(500).json({
      success:false,
      message:"Error en reconocimiento facial"
    });

  }

});

/* =========================
   GUARDAR FOTO
========================= */
app.post('/guardar-foto', upload.single('foto'), async (req, res) => {

  try {

    const { codigosap, dni } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No se envió foto" });
    }

    const foto = req.file.buffer;

    console.log("Guardando foto para:", codigosap);
    console.log("Tamaño:", foto.length);

    await pool.query(
      `INSERT INTO foto 
      (IDFOTO,CODIGOSAP,DNI,FOTO,VIGENCIA,CODIGOTIPOPERSONA,
      CODIGODEPENDENCIA,CODIGOUSUARIOCREACION,FECHAHORACREACION)
      VALUES
      (UUID(),?,?,?,?,?,?,?,NOW())`,
      [
        codigosap,
        dni,
        foto,
        1,
        '1',
        '001',
        'APP'
      ]
    );

    res.json({
      success: true,
      message: "Foto guardada correctamente"
    });

  } catch (error) {

    console.error("Error guardando foto:", error);

    res.status(500).json({
      error: "Error guardando foto"
    });

  }

});


/* =========================
   OBTENER FOTO
========================= */

app.get("/foto/:codigosap", async (req, res) => {

  try {

    const { codigosap } = req.params;

    console.log("=================================");
    console.log("REQUEST: GET /foto/" + codigosap);
    console.log("TIME:", new Date().toISOString());
    console.log("=================================");

    const [rows] = await pool.query(
      "SELECT FOTO FROM foto WHERE CODIGOSAP = ? LIMIT 1",
      [codigosap]
    );

    if (!rows.length) {

      console.log("No existe foto");

      return res.status(404).json({
        success:false,
        message:"Foto no encontrada"
      });

    }

    let foto = rows[0].FOTO;

    console.log("Tipo dato foto:", typeof foto);

    /* =========================
       SI VIENE COMO BUFFER
    ========================= */

    if (Buffer.isBuffer(foto)) {

      const texto = foto.toString().trim();

      // Detectar si el buffer contiene base64
      if (texto.startsWith("/9j/") || texto.startsWith("iVBOR")) {

        console.log("Foto detectada como BASE64");

        foto = Buffer.from(texto, "base64");

      }

    }

    /* =========================
       SI VIENE COMO STRING BASE64
    ========================= */

    if (typeof foto === "string") {

      console.log("Foto es STRING Base64");

      foto = Buffer.from(foto.trim(), "base64");

    }

    console.log("Tamaño imagen (bytes):", foto.length);

    /* =========================
       RESPUESTA
    ========================= */

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": foto.length
    });

    res.end(foto);

  } catch (error) {

    console.error("ERROR OBTENIENDO FOTO:");
    console.error(error);

    res.status(500).json({
      success:false,
      message:"Error obteniendo foto"
    });

  }

});

/* =========================
   PERFIL
========================= */
app.get("/perfil/:codigoSAP", async (req, res) => {

  console.log("=================================");
  console.log("REQUEST: GET /perfil/" + req.params.codigoSAP);
  console.log("TIME:", new Date().toISOString());
  console.log("=================================");

  try {

    const { codigoSAP } = req.params;

    const [rows] = await pool.query(`
      SELECT 
          e.CodigoSAP AS codigoSAP,
          e.Nombres AS nombres,
          e.ApellidoPaterno AS apellidoPaterno,
          e.ApellidoMaterno AS apellidoMaterno,
          e.Direccion AS direccion,
          a.ANOINGRESO AS anioIngreso,
          a.SEMESTREINGRESO AS semestreIngreso,
          esc.DENOMINACION AS escuela,
          t.NUMERO AS celular,
          em.EMAIL AS gmailPersonal,

          CASE 
            WHEN f.FOTO IS NOT NULL 
            THEN CONCAT('data:image/jpeg;base64,', TO_BASE64(f.FOTO))
            ELSE NULL
          END AS foto

      FROM estudiante e

      LEFT JOIN admision a 
        ON e.CodigoSAP = a.CODIGOSAP

      LEFT JOIN planestudios pe 
        ON a.CLAVEPLANESTUDIOS = pe.CLAVE

      LEFT JOIN escuela esc 
        ON pe.CLAVEESCUELA = esc.CLAVE

      LEFT JOIN telefono t 
        ON e.CodigoSAP = t.CODIGOSAP 
        AND t.CODIGOTIPOTELEFONO = '02'

      LEFT JOIN email em 
        ON e.CodigoSAP = em.CODIGOSAP 
        AND em.CODIGOTIPOEMAIL = '04'

      LEFT JOIN foto f
        ON e.CodigoSAP = f.CODIGOSAP

      WHERE e.CodigoSAP = ?
      ORDER BY a.ANOINGRESO DESC
      LIMIT 1
    `, [codigoSAP]);

    if (!rows.length) {

      console.log("Estudiante no encontrado:", codigoSAP);

      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado"
      });

    }

    const perfil = rows[0];

    console.log("RESPONSE DATA:");
    console.log({
      codigoSAP: perfil.codigoSAP,
      nombres: perfil.nombres,
      fotoPreview: perfil.foto ? perfil.foto.substring(0,80) : "SIN FOTO"
    });

    res.json({
      success: true,
      data: perfil
    });

  } catch (error) {

    console.error("ERROR /perfil:", error);

    res.status(500).json({
      success: false,
      message: "Error obteniendo perfil"
    });

  }

});
/* =========================================
   RUTA PARA SUBIR/ACTUALIZAR FOTO DE PERFIL
============================================ */
app.post("/perfil/foto", upload.single('foto'), async (req, res) => {
  try {
    const { codigoSAP } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se subió ninguna imagen" });
    }

    const fotoBuffer = req.file.buffer; // Aquí está el longblob

    // Query optimizado para tu tabla 'foto'
    // Se inserta si no existe, o se actualiza si el CODIGOSAP ya está en la tabla
    const query = `
      INSERT INTO foto (
        CODIGOSAP, 
        FOTO, 
        VIGENCIA, 
        FECHAHORACREACION, 
        CODIGOTIPOPERSONA,
        CODIGODEPENDENCIA,
        CODIGOUSUARIOCREACION,
        CODIGOUSUARIOMODIFICACION,
        FECHAHORAMODIFICACION
      ) VALUES (?, ?, 1, NOW(), 'E', 'DEP01', 'APP_MOBILE', 'APP_MOBILE', NOW())
      ON DUPLICATE KEY UPDATE 
        FOTO = ?, 
        FECHAHORAMODIFICACION = NOW(),
        CODIGOUSUARIOMODIFICACION = 'APP_MOBILE'
    `;

    await pool.query(query, [codigoSAP, fotoBuffer, fotoBuffer]);

    res.json({
      success: true,
      message: "Foto actualizada correctamente en la base de datos"
    });

  } catch (error) {
    console.error("Error al guardar foto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al procesar la imagen"
    });
  }
});

/* =========================
   ACTUALIZAR PERFIL
========================= */
app.put("/perfil/actualizar", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { codigoSAP, direccion, celular, gmailPersonal, foto } = req.body;

    if (!codigoSAP) {
      return res.status(400).json({
        success: false,
        message: "Código SAP requerido"
      });
    }

    await connection.beginTransaction();

    // 1. ACTUALIZAR DIRECCIÓN
    await connection.query(
      `UPDATE estudiante SET DIRECCION = ? WHERE CODIGOSAP = ?`,
      [direccion, codigoSAP]
    );

    // 2. ACTUALIZAR O INSERTAR CELULAR (Tipo '02')
    const [telCheck] = await connection.query(
      "SELECT 1 FROM telefono WHERE CODIGOSAP = ? AND CODIGOTIPOTELEFONO = '02'",
      [codigoSAP]
    );

    if (telCheck.length > 0) {
      await connection.query(
        "UPDATE telefono SET NUMERO = ? WHERE CODIGOSAP = ? AND CODIGOTIPOTELEFONO = '02'",
        [celular, codigoSAP]
      );
    } else {
      await connection.query(
        "INSERT INTO telefono (CODIGOSAP, CODIGOTIPOTELEFONO, NUMERO) VALUES (?, '02', ?)",
        [codigoSAP, celular]
      );
    }

    // 3. ACTUALIZAR O INSERTAR EMAIL (Tipo '04')
    const [mailCheck] = await connection.query(
      "SELECT 1 FROM email WHERE CODIGOSAP = ? AND CODIGOTIPOEMAIL = '04'",
      [codigoSAP]
    );

    if (mailCheck.length > 0) {
      await connection.query(
        "UPDATE email SET EMAIL = ? WHERE CODIGOSAP = ? AND CODIGOTIPOEMAIL = '04'",
        [gmailPersonal, codigoSAP]
      );
    } else {
      await connection.query(
        "INSERT INTO email (CODIGOSAP, CODIGOTIPOEMAIL, EMAIL) VALUES (?, '04', ?)",
        [codigoSAP, gmailPersonal]
      );
    }

    // 4. PROCESAR FOTO
    if (foto) {
      // Eliminamos el prefijo data:image/... si existe
      const base64Data = foto.replace(/^data:image\/\w+;base64,/, "");
      const bufferFoto = Buffer.from(base64Data, "base64");

      const [fotoCheck] = await connection.query(
        "SELECT 1 FROM foto WHERE CODIGOSAP = ?",
        [codigoSAP]
      );

      if (fotoCheck.length > 0) {
        await connection.query(
          "UPDATE foto SET FOTO = ? WHERE CODIGOSAP = ?",
          [bufferFoto, codigoSAP]
        );
      } else {
        await connection.query(
          "INSERT INTO foto (CODIGOSAP, FOTO, VIGENCIA) VALUES (?, ?, 1)",
          [codigoSAP, bufferFoto]
        );
      }
    }

    await connection.commit();
    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente"
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("ERROR ACTUALIZAR PERFIL:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al actualizar perfil"
    });
  } finally {
    if (connection) connection.release();
  }
});

/* =========================
   OBTENER PERFIL DOCENTE
========================= */
app.get('/perfildoc/:codigosap', async (req, res) => {
  const { codigosap } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT 
        p.CODIGOSAP,
        p.NOMBRES,
        p.APELLIDOPATERNO,
        p.APELLIDOMATERNO,
        p.DIRECCION,
        t.NUMERO AS CELULAR,
        e.EMAIL AS CORREO_PERSONAL
      FROM persona p
      LEFT JOIN telefono t 
        ON p.CODIGOSAP = t.CODIGOSAP 
        AND t.CODIGOTIPOTELEFONO = '02'   -- teléfono personal
        AND t.VIGENCIA = 1
      LEFT JOIN email e 
        ON p.CODIGOSAP = e.CODIGOSAP 
        AND e.CONTADOR = 2
      WHERE p.CODIGOSAP = ?
    `, [codigosap]);

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: 'Docente no encontrado'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.log("ERROR PERFIL DOC:", error);         
    res.status(500).json({
      success: false,
      message: 'Error obteniendo perfil docente'
    });
  }
});

/* =========================
   ACTUALIZAR PERFIL DOCENTE
========================= */
app.put('/perfildoc/actualizar', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const body = req.body || {};
    const codigosap = body.codigosap;
    const direccion = body.direccion;
    const celular = body.celular;
    const correo = body.correo;

    if (!codigosap) {
      return res.status(400).json({
        success: false,
        message: "Código SAP requerido"
      });
    }

    await connection.beginTransaction();

    /* =========================
       ACTUALIZAR DIRECCION
    ========================= */
    if (direccion) {
      await connection.query(
        `UPDATE persona
         SET DIRECCION = ?,
             CODIGOUSUARIOMODIFICACION = 'APP',
             FECHAHORAMODIFICACION = NOW()
         WHERE CODIGOSAP = ?`,
        [direccion, codigosap]
      );
    }

    /* =========================
       TELEFONO PERSONAL
    ========================= */
    if (celular) {
      const [telefonoExiste] = await connection.query(
        `SELECT *
         FROM telefono
         WHERE CODIGOSAP = ?
         AND CODIGOTIPOTELEFONO = '02'`,
        [codigosap]
      );

      if (telefonoExiste.length > 0) {
        await connection.query(
          `UPDATE telefono
           SET NUMERO = ?,
               CODIGOUSUARIOMODIFICACION = 'APP',
               FECHAHORAMODIFICACION = NOW()
           WHERE CODIGOSAP = ?
           AND CODIGOTIPOTELEFONO = '02'`,
          [celular, codigosap]
        );
      } else {
        await connection.query(
          `INSERT INTO telefono
          (
            CODIGOSAP,
            CONTADOR,
            NUMERO,
            CODIGOTIPOTELEFONO,
            VIGENCIA,
            CODIGOUSUARIOCREACION,
            FECHAHORACREACION,
            CODIGOUSUARIOMODIFICACION,
            FECHAHORAMODIFICACION
          )
          VALUES
          (
            ?,1,?, '02',0,
            'APP',NOW(),
            'APP',NOW()
          )`,
          [codigosap, celular]
        );
      }
    }

    /* =========================
       EMAIL PERSONAL
    ========================= */
    if (correo) {
      const [emailExiste] = await connection.query(
        `SELECT *
         FROM email
         WHERE CODIGOSAP = ?
         AND CONTADOR = 2`,
        [codigosap]
      );

      if (emailExiste.length > 0) {
        await connection.query(
          `UPDATE email
           SET EMAIL = ?,
               CODIGOUSUARIOMODIFICACION = 'APP',
               FECHAHORAMODIFICACION = NOW()
           WHERE CODIGOSAP = ?
           AND CONTADOR = 2`,
          [correo, codigosap]
        );
      } else {
        await connection.query(
          `INSERT INTO email
          (
            CODIGOSAP,
            CONTADOR,
            EMAIL,
            CODIGOTIPOEMAIL,
            VIGENCIA,
            CODIGOUSUARIOCREACION,
            FECHAHORACREACION,
            CODIGOUSUARIOMODIFICACION,
            FECHAHORAMODIFICACION
          )
          VALUES
          (
            ?,2,?, '04',0,
            'APP',NOW(),
            'APP',NOW()
          )`,
          [codigosap, correo]
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Perfil docente actualizado correctamente"
    });

  } catch (error) {
    await connection.rollback();
    console.log("ERROR ACTUALIZAR PERFIL DOC:", error);
    res.status(500).json({
      success: false,
      message: "Error actualizando perfil docente"
    });
  } finally {
    connection.release();
  }
});

module.exports = app;

/* =========================
   MOTIVOS DE TRÁMITES
========================= */

app.get('/tramites/motivos', async (req, res) => {
  try {

    const [rows] = await pool.query(`
      SELECT CODIGO, DESCRIPCION
      FROM motivodocumento
      WHERE VIGENCIA = 1
      ORDER BY DESCRIPCION ASC
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
    ORÍGENES DE TRÁMITES
========================= */

app.get('/tramites/origen', async (req, res) => {

  const [rows] = await pool.query(`
    SELECT CODIGO, DESCRIPCION
    FROM OrigenDocumento
    WHERE VIGENCIA = 1
    ORDER BY DESCRIPCION ASC
  `);

  res.json(rows);

});

/* =========================
    TIPOS DE TRÁMITES
========================= */

app.get('/tramites/tipos', async (req, res) => {

  const [rows] = await pool.query(`
    SELECT CODIGO, DESCRIPCION
    FROM TipoDocumento
    WHERE VIGENCIA = 1
    ORDER BY DESCRIPCION ASC
  `);

  res.json(rows);

});

/* =========================
   RECIBOS
========================= */

app.get('/recibos/:codigosap', async (req, res) => {
  try {

    const { codigosap } = req.params;
    let { estado, claseobjeto } = req.query;
    // aceptar 'periodo' o 'claveperiodo' desde el cliente
    let claveperiodo = req.query.claveperiodo || req.query.periodo || null;

    if (!codigosap) {
      return res.status(400).json({
        success: false,
        message: "CODIGOSAP obligatorio"
      });
    }

    estado = estado || null;
    claseobjeto = claseobjeto || null;
    claveperiodo = claveperiodo || null;

    console.log('RECIBOS params ->', { codigosap, estado, claseobjeto, claveperiodo });

    // Consulta más simple y segura para evitar problemas con GROUP BY / columnas faltantes
    let query = `
      SELECT 
        r.CONSECUTIVORECIBO,
        r.NUMERO,
        r.IMPORTE,
        r.FECHACONTABILIZACION,
        r.FECHAVENCIMIENTO,
        r.CODIGOESTADORECIBO,
        r.CODIGOCLASEOBJETO,
        r.CLAVEPERIODO,
        co.DENOMINACION AS concepto,
        p.CLAVE AS periodoClave,
        p.ANO AS periodoAno,
        p.SEMESTRE AS periodoSemestre,
        p.DESCRIPCION AS periodoDescripcionDetalle,
        CONCAT(COALESCE(p.ANO,''), ' - ', COALESCE(p.DESCRIPCION,'')) AS periodoDescripcion,
        CASE 
          WHEN r.CODIGOESTADORECIBO = 'P' THEN 'Pendiente'
          WHEN r.CODIGOESTADORECIBO = 'C' THEN 'Cancelado'
          ELSE 'Desconocido'
        END AS estadoDescripcion
      FROM recibo r
      LEFT JOIN claseobjeto co 
        ON r.CODIGOCLASEOBJETO = co.CODIGO
      LEFT JOIN periodo p
        ON r.CLAVEPERIODO = p.CLAVE
      WHERE r.CODIGOSAP = ?
        AND r.VIGENCIA = 1
    `;

    const params = [codigosap];

    if (estado) {
      query += ` AND r.CODIGOESTADORECIBO = ?`;
      params.push(estado);
    }

    if (claseobjeto) {
      query += ` AND r.CODIGOCLASEOBJETO = ?`;
      params.push(claseobjeto);
    }

    if (claveperiodo) {
      query += ` AND r.CLAVEPERIODO = ?`;
      params.push(claveperiodo);
    }

    query += ` ORDER BY r.FECHACONTABILIZACION DESC`;

    const [rows] = await pool.query(query, params);

    return res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("ERROR OBTENIENDO RECIBOS:", error?.message || error, error?.stack || '');
    // devolver detalle mínimo para debug en front
    return res.status(500).json({
      success: false,
      message: "Error obteniendo recibos",
      error: error?.message
    });
  }
});

/* =========================
   CONCEPTOS
========================= */
app.get('/recibos/conceptos/:codigosap', async (req, res) => {
  try {

    const { codigosap } = req.params;

    const [rows] = await pool.query(`
      SELECT DISTINCT
        r.CODIGOCLASEOBJETO AS codigo,
        co.DENOMINACION AS concepto
      FROM recibo r
      INNER JOIN claseobjeto co
        ON r.CODIGOCLASEOBJETO = co.CODIGO
      WHERE r.CODIGOSAP = ?
        AND r.VIGENCIA = 1
      ORDER BY co.DENOMINACION ASC
    `, [codigosap]);

    res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo conceptos"
    });
  }
});

/* =========================
   PERIODOS
========================= */
app.get('/recibos/periodos/:codigosap', async (req, res) => {
  try {

    const { codigosap } = req.params;

    if (!codigosap) {
      return res.status(400).json({
        success: false,
        message: "Código SAP requerido"
      });
    }

    const [rows] = await pool.query(`
      SELECT 
        p.CLAVE AS codigo,
        CONCAT(p.ANO, ' - Semestre ', p.SEMESTRE) AS descripcion,
        p.DESCRIPCION AS DESCRIPCION,
        p.ANO AS anio,
        p.SEMESTRE AS semestre
      FROM periodo p
      INNER JOIN recibo r 
        ON r.CLAVEPERIODO = p.CLAVE
      WHERE r.CODIGOSAP = ?
        AND r.VIGENCIA = 1
      GROUP BY p.CLAVE, p.ANO, p.SEMESTRE, p.DESCRIPCION
      ORDER BY p.ANO DESC, p.SEMESTRE DESC
    `, [codigosap]);

    return res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("ERROR OBTENIENDO PERIODOS:", error);

    return res.status(500).json({
      success: false,
      message: "Error obteniendo periodos"
    });
  }
});

/* =========================
   MALLA CURRICULAR
========================= */

/* =========================
   LISTAR PLANES POR ESTUDIANTE
========================= */
app.get('/malla/planes/:codigosap', async (req, res) => {
  try {
    const { codigosap } = req.params;

    if (!codigosap) {
      return res.status(400).json({ success: false, message: "Código SAP requerido" });
    }

    // Consulta mejorada: Traemos los planes asociados al estudiante
    // Usamos DISTINCT para evitar duplicados si el estudiante tiene varios registros
    const [rows] = await pool.query(`
      SELECT DISTINCT 
             p.CLAVE,
             p.CODIGO,
             p.DENOMINACION
      FROM estudiante e
      INNER JOIN planestudios p ON e.CLAVEPLANESTUDIOS = p.CLAVE
      WHERE e.CODIGOSAP = ?
    `, [codigosap]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No se encontraron planes" });
    }

    return res.json({ success: true, total: rows.length, data: rows });

  } catch (error) {
    console.error("ERROR OBTENIENDO PLANES:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

/* =========================
   DETALLE DE MALLA POR PLAN
========================= */
app.get('/malla/plan/:claveplan', async (req, res) => {
  try {
    const { claveplan } = req.params;

    if (!claveplan) {
      return res.status(400).json({ success: false, message: "Clave de plan requerida" });
    }

    // Ajustamos para incluir CODIGO y CODIGOTIPOOBJETO que usa la interfaz
    const [rows] = await pool.query(`
      SELECT m.CLAVE,
             m.CODIGO,
             m.DENOMINACION,
             m.CODIGOCICLO,
             m.CREDITOS,
             m.CODIGOTIPOOBJETO,
             m.VIGENCIA
      FROM modulo m
      INNER JOIN grupomodulos g ON g.CLAVE = m.CLAVEGRUPOMODULOS
      WHERE g.CLAVEPLANESTUDIOS = ?
      ORDER BY m.CODIGOCICLO ASC, m.DENOMINACION ASC
    `, [claveplan]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Malla no encontrada" });
    }

    return res.json({ success: true, total: rows.length, data: rows });

  } catch (error) {
    console.error("ERROR OBTENIENDO MALLA:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

// ==========================================
//  OBTENER SEMESTRES DISPONIBLES POR ALUMNO
// ==========================================

app.get('/matricula/semestres/:codigosap', async (req, res) => {
  const { codigosap } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT 
        ANO,
        SEMESTRE
      FROM MATRICULA
      WHERE CODIGOSAP = ?
      ORDER BY ANO DESC, SEMESTRE DESC
    `, [codigosap]);

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: 'No tiene matrículas registradas'
      });
    }

    res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('ERROR SEMESTRES:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});


// ==========================================
//  OBTENER MATRÍCULA POR CODIGOSAP / AÑO / SEMESTRE
// ==========================================

app.get('/matricula/:codigosap/:anio/:semestre', async (req, res) => {
  const { codigosap, anio, semestre } = req.params;

  console.log('=== PETICIÓN MATRÍCULA ===');
  console.log('Código:', codigosap);
  console.log('Año:', anio);
  console.log('Semestre:', semestre);

  try {

    const [rows] = await pool.query(`
      SELECT 
          M.DENOMINACION AS CURSO,
          CONCAT(
            IFNULL(DOC.APELLIDOPATERNO,''),' ',
            IFNULL(DOC.APELLIDOMATERNO,''),' ',
            IFNULL(DOC.NOMBRES,'')
          ) AS DOCENTE,
          IFNULL(DIA.DENOMINACION,'') AS DIA,
          OFE.HORAINICIO,
          OFE.HORAFIN,
          IFNULL(AUL.DENOMINACION,'') AS AULA,
          IFNULL(PAB.DENOMINACION,'') AS PABELLON,
          IFNULL(TUR.DENOMINACION,'') AS TURNO

      FROM MATRICULA MAT

      LEFT JOIN PAQUETEEVENTOS PAQ
        ON MAT.ABREVIATURAPAQUETEEVENTOS = PAQ.ABREVIATURA 
        AND PAQ.ANO = MAT.ANO 
        AND PAQ.SEMESTRE = MAT.SEMESTRE
        AND MAT.CLAVEPLANESTUDIOS = PAQ.CLAVEPLANESTUDIOS
      
      LEFT JOIN MODULO M 
        ON M.CLAVE = PAQ.CLAVEMODULO

      LEFT JOIN PAQUETEEVENTOS2 PAQ1 
        ON PAQ.ABREVIATURA = PAQ1.ABREVIATURA 
        AND PAQ.ANO = PAQ1.ANO 
        AND PAQ.SEMESTRE = PAQ1.SEMESTRE

      LEFT JOIN EVENTO2 EVE1 
        ON EVE1.ABREVIATURAPAQUETEEVENTOS = PAQ1.ABREVIATURA 
        AND EVE1.ANO = PAQ1.ANO 
        AND EVE1.SEMESTRE = PAQ1.SEMESTRE 

      LEFT JOIN OFERTA2 OFE 
        ON OFE.CLAVEEVENTO = EVE1.CLAVE

      LEFT JOIN PERSONA DOC 
        ON OFE.CODIGOSAPDOCENTE = DOC.CODIGOSAP

      LEFT JOIN DIA 
        ON OFE.CODIGODIA = DIA.CODIGO

      LEFT JOIN AULA AUL 
        ON OFE.CODIGOAULA = AUL.CODIGO

      LEFT JOIN PABELLON PAB 
        ON AUL.CODIGOPABELLON = PAB.CODIGO

      LEFT JOIN TURNO TUR 
        ON OFE.CODIGOTURNO = TUR.CODIGO

      WHERE MAT.CODIGOSAP = ?
        AND MAT.ANO = ?
        AND MAT.SEMESTRE = ?

      ORDER BY IFNULL(DIA.ORDEN, 99), OFE.HORAINICIO
    `, [codigosap, anio, semestre]);

    console.log('Filas encontradas:', rows.length);

    if (!rows || rows.length === 0) {
      return res.json({
        success: false,
        message: 'No se encontró matrícula para los parámetros enviados'
      });
    }

    res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {

    console.error('ERROR MATRÍCULA DETALLE:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* =========================
   HORARIO POR CODIGOSAP / AÑO / SEMESTRE
========================= */

app.get('/horario/:codigosap/:anio/:semestre', async (req, res) => {
  const { codigosap, anio, semestre } = req.params;

  try {

    const [rows] = await pool.query(`
      SELECT
          M.DENOMINACION AS CURSO,
          IFNULL(DIA.DENOMINACION,'') AS DIA,
          OFE.HORAINICIO,
          OFE.HORAFIN
      FROM MATRICULA MAT
      LEFT JOIN PAQUETEEVENTOS PAQ
        ON MAT.ABREVIATURAPAQUETEEVENTOS = PAQ.ABREVIATURA 
        AND PAQ.ANO = MAT.ANO 
        AND PAQ.SEMESTRE = MAT.SEMESTRE
        AND MAT.CLAVEPLANESTUDIOS = PAQ.CLAVEPLANESTUDIOS
      LEFT JOIN MODULO M 
        ON M.CLAVE = PAQ.CLAVEMODULO
      LEFT JOIN PAQUETEEVENTOS2 PAQ1 
        ON PAQ.ABREVIATURA = PAQ1.ABREVIATURA 
        AND PAQ.ANO = PAQ1.ANO 
        AND PAQ.SEMESTRE = PAQ1.SEMESTRE
      LEFT JOIN EVENTO2 EVE1 
        ON EVE1.ABREVIATURAPAQUETEEVENTOS = PAQ1.ABREVIATURA 
        AND EVE1.ANO = PAQ1.ANO 
        AND EVE1.SEMESTRE = PAQ1.SEMESTRE 
      LEFT JOIN OFERTA2 OFE 
        ON OFE.CLAVEEVENTO = EVE1.CLAVE
      LEFT JOIN DIA 
        ON OFE.CODIGODIA = DIA.CODIGO
      WHERE MAT.CODIGOSAP = ?
        AND MAT.ANO = ?
        AND MAT.SEMESTRE = ?
      ORDER BY IFNULL(DIA.ORDEN, 99), OFE.HORAINICIO
    `, [codigosap, anio, semestre]);

    res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   OBTENER CURSOS POR ESTUDIANTE / AÑO / SEMESTRE
========================= */
app.get('/matricula/cursos/:codigosap/:ano/:semestre', async (req, res) => {
  const { codigosap, ano, semestre } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT
        PAQ.CLAVE AS CLAVE_PAQUETE,
        PAQ.ABREVIATURA AS ABREVIATURA,
        M.DENOMINACION AS NOMBRE_CURSO,
        M.CODIGO AS CODIGO_CURSO,
        M.CREDITOS,
        M.CODIGOCICLO
      FROM MATRICULA MAT
      INNER JOIN PAQUETEEVENTOS PAQ
        ON MAT.ABREVIATURAPAQUETEEVENTOS = PAQ.ABREVIATURA
        AND MAT.ANO = PAQ.ANO
        AND MAT.SEMESTRE = PAQ.SEMESTRE
        AND MAT.CLAVEPLANESTUDIOS = PAQ.CLAVEPLANESTUDIOS
      INNER JOIN MODULO M
        ON M.CLAVE = PAQ.CLAVEMODULO
      WHERE MAT.CODIGOSAP = ?
        AND MAT.ANO = ?
        AND MAT.SEMESTRE = ?
      ORDER BY M.DENOMINACION ASC
    `, [codigosap, ano, semestre]);

    return res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("ERROR OBTENIENDO CURSOS:", error);
    return res.status(500).json({
      success: false,
      message: "Error obteniendo cursos"
    });
  }
});

/* =========================
   OBTENER ASISTENCIA ALUMNO (CORREGIDA Y OPTIMIZADA)
========================= */
app.get('/asistencia/:codigosap/:ano/:semestre/:clavePaquete/:abreviaturaPaquete', async (req, res) => {
  const { codigosap, ano, semestre, clavePaquete, abreviaturaPaquete } = req.params;

  try {
    const [rows] = await pool.query(`
      WITH RECURSIVE fechas_clase AS (
          SELECT s.FECHAINICIO AS fecha
          FROM semestre s
          WHERE s.ANO = ? AND s.SEMESTRE = ?
          UNION ALL
          SELECT DATE_ADD(fecha, INTERVAL 1 DAY)
          FROM fechas_clase
          WHERE fecha < (
              SELECT s.FECHAFIN
              FROM semestre s
              WHERE s.ANO = ? AND s.SEMESTRE = ?
          )
      )
      SELECT DISTINCT
          f.fecha,
          ev.ABREVIATURA AS evento,
          COALESCE(aa.estado_asistencia, 'SIN REGISTRO') AS estado
      FROM fechas_clase f
      JOIN paqueteeventos paq
          ON paq.CLAVE = ?
         AND paq.ABREVIATURA = ?
      JOIN evento ev
          ON ev.ABREVIATURAPAQUETEEVENTOS = paq.ABREVIATURA
         AND ev.ANO = ?
         AND ev.SEMESTRE = ?
      JOIN oferta ofe
          ON ofe.CLAVEEVENTO = ev.CLAVE
         AND ofe.ANO = ev.ANO
         AND ofe.SEMESTRE = ev.SEMESTRE
      LEFT JOIN asistencia_alumno aa
          ON TRIM(aa.claveevento) = TRIM(ev.CLAVE) -- Limpieza de espacios
         AND aa.fecha_evento = f.fecha
         AND aa.codigosap_alumno = ?
      WHERE ofe.CODIGODIA =
          CASE DAYOFWEEK(f.fecha)
              WHEN 1 THEN 'DO'
              WHEN 2 THEN 'LU'
              WHEN 3 THEN 'MA'
              WHEN 4 THEN 'MI'
              WHEN 5 THEN 'JU'
              WHEN 6 THEN 'VI'
              WHEN 7 THEN 'SA'
          END
      AND f.fecha <= CURDATE()
      ORDER BY f.fecha;
    `, [ano, semestre, ano, semestre, clavePaquete, abreviaturaPaquete, ano, semestre, codigosap]);

    res.json({
      success: true,
      data: rows || []
    });

  } catch (error) {
    console.error("ERROR ASISTENCIA ALUMNO:", error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo asistencia del alumno'
    });
  }
});


/* =========================
   SERVER
========================= */
app.listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3001}`);
});