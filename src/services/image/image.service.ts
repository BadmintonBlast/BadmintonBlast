import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  resizeImage(file: File, desiredWidth: number, desiredHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = desiredWidth;
          canvas.height = desiredHeight;

          // Fill canvas with white background
          if (ctx) {
            ctx.fillStyle = 'white'; // Set background color
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw background

            // Calculate aspect ratio and scale image
            const aspectRatio = img.width / img.height;
            let width = desiredWidth;
            let height = desiredHeight;

            if (desiredWidth / desiredHeight > aspectRatio) {
              width = desiredHeight * aspectRatio;
              height = desiredHeight;
            } else {
              width = desiredWidth;
              height = desiredWidth / aspectRatio;
            }

            // Draw the image on the canvas with the new dimensions
            const offsetX = (desiredWidth - width) / 2;
            const offsetY = (desiredHeight - height) / 2;

            ctx.drawImage(img, offsetX, offsetY, width, height);

            // Get the resized image data URL
            const resizedImageURL = canvas.toDataURL('image/jpeg');
            resolve(resizedImageURL);
          } else {
            reject('Canvas context is not available');
          }
        };
      };

      reader.readAsDataURL(file);
    });
  }
}
