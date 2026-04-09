import mysql.connector
import base64
import os

# crear carpeta dataset si no existe
os.makedirs("dataset", exist_ok=True)

# conexión a la base de datos
conexion = mysql.connector.connect(
    host="172.19.1.220",
    user="rdescalzi",
    password="Iniciousmp_2026*",
    database="sap",
    port=3306
)

cursor = conexion.cursor()

query = """
SELECT CODIGOSAP, FOTO
FROM foto
WHERE VIGENCIA = 1
"""

cursor.execute(query)

total = 0

for codigosap, foto in cursor.fetchall():

    if foto:

        try:
            # decodificar base64
            imagen = base64.b64decode(foto)

            # guardar imagen
            ruta = f"dataset/{codigosap}.jpg"

            with open(ruta, "wb") as f:
                f.write(imagen)

            print("Imagen guardada:", ruta)

            total += 1

        except Exception as e:
            print("Error con:", codigosap, e)

cursor.close()
conexion.close()

print("Total de imágenes exportadas:", total)