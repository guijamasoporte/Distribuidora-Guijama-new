import axios from "axios";

export const fileUpload = async (images:any[], path:string) => {

  try {
    let arrayUrls:string[] = [];

    await Promise.all(
      images.map(async (el) => {
        if (typeof el === "string") {
          arrayUrls.push(el);
        } else {
          const formData = new FormData();
          formData.append("file", el);
          formData.append("upload_preset", `guijama_${path}`);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
            formData
          );
          console.log(res);
          arrayUrls.push(res.data.secure_url);
        }
      })
    );

    return arrayUrls;
  } catch (error) {
    throw error;
  }
};
