from fastapi import FastAPI, UploadFile, File
import numpy as np
import pickle
import cv2
import tempfile
import os
from deepface import DeepFace

app = FastAPI()

print("===== INICIANDO API FACIAL =====")

# =========================
# CARGAR EMBEDDINGS
# =========================

try:
    with open("embeddings.pkl", "rb") as f:
        data = pickle.load(f)

    embeddings_db = data["embeddings"]
    ids_db = data["ids"]

    print("Embeddings cargados:", len(embeddings_db))

except Exception as e:
    print("ERROR cargando embeddings:", e)
    embeddings_db = []
    ids_db = []


# =========================
# LOGIN FACIAL
# =========================

@app.post("/login-face")
async def login_face(file: UploadFile = File(...)):

    print("\n======== LOGIN FACE ========")

    img_path = None

    try:

        contents = await file.read()

        if not contents or len(contents) == 0:
            print("Imagen vacía")
            return {
                "login": False,
                "message": "Imagen vacía"
            }

        print("Imagen recibida:", len(contents), "bytes")

        # =========================
        # GUARDAR IMAGEN TEMPORAL
        # =========================

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
            temp.write(contents)
            img_path = temp.name

        print("Imagen temporal:", img_path)

        # =========================
        # LEER IMAGEN
        # =========================

        img = cv2.imread(img_path)

        if img is None:
            print("No se pudo leer la imagen")
            return {
                "login": False,
                "message": "No se pudo leer la imagen"
            }

        print("Imagen cargada correctamente")

        # =========================
        # GENERAR EMBEDDING
        # =========================

        representation = DeepFace.represent(
            img_path=img_path,
            model_name="Facenet",
            enforce_detection=False
        )

        if len(representation) == 0:
            print("No se detectó rostro")
            return {
                "login": False,
                "message": "No se detectó rostro"
            }

        embedding = np.array(representation[0]["embedding"])

        print("Embedding generado")

        # =========================
        # BUSCAR COINCIDENCIA
        # =========================

        min_dist = float("inf")
        best_match = None

        for i, emb in enumerate(embeddings_db):

            emb = np.array(emb)

            dist = np.linalg.norm(embedding - emb)

            if dist < min_dist:
                min_dist = dist
                best_match = ids_db[i]

        print("Usuario encontrado:", best_match)
        print("Distancia mínima:", min_dist)

        # =========================
        # THRESHOLD
        # =========================

        threshold = 0.95

        if min_dist < threshold:

            print("LOGIN EXITOSO")

            return {
                "login": True,
                "codigosap": best_match,
                "distancia": float(min_dist)
            }

        print("ROSTRO NO RECONOCIDO")

        return {
            "login": False,
            "message": "Rostro no reconocido",
            "distancia": float(min_dist)
        }

    except Exception as e:

        print("ERROR EN LOGIN:", str(e))

        return {
            "login": False,
            "error": str(e)
        }

    finally:

        # =========================
        # ELIMINAR IMAGEN TEMPORAL
        # =========================

        if img_path and os.path.exists(img_path):
            os.remove(img_path)
            print("Imagen temporal eliminada")