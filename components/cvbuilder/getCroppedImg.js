export default function getCroppedImg(imageSrc, crop, zoom) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = 300;

      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(
        image,
        image.width * crop.x * -1,
        image.height * crop.y * -1,
        image.width * zoom,
        image.height * zoom
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
}
