import api from './api';

/* =========================
   LOGIN NORMAL
========================= */
export const loginRequest = async (dni, email) => {

  const response = await api.post('/login', {
    dni,
    email,
  });

  return response.data;

};


/* =========================
   LOGIN FACIAL
========================= */
export const loginFaceRequest = async (imageUri) => {

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: 'face.jpg',
    type: 'image/jpeg'
  });

  const response = await api.post('/login-face', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;

};