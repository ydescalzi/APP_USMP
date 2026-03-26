import os
import pickle
from deepface import DeepFace

dataset_path = "dataset"

embeddings = []
ids = []

for file in os.listdir(dataset_path):

    if file.endswith(".jpg") or file.endswith(".png"):

        path = os.path.join(dataset_path, file)

        try:

            result = DeepFace.represent(
                img_path=path,
                model_name="Facenet",  
                enforce_detection=False
            )

            embedding = result[0]["embedding"]

            codigosap = os.path.splitext(file)[0]

            embeddings.append(embedding)
            ids.append(codigosap)

            print("Embedding generado:", codigosap)

        except Exception as e:

            print("Error en", file, e)

data = {
    "embeddings": embeddings,
    "ids": ids
}

with open("embeddings.pkl", "wb") as f:
    pickle.dump(data, f)

print("Embeddings guardados en embeddings.pkl")