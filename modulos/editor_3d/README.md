# Red Estampacion

## Features

- **AI-Powered Design Suggestions**: Generate unique T-shirt designs using AI algorithms.
- **3D Visualization**: View and manipulate your T-shirt designs in a 3D environment.
- **Customizable Options**: Customize colors, patterns, and graphics to create your perfect T-shirt.
- **Real-Time Rendering**: Experience real-time updates as you tweak your designs.
- **User-Friendly Interface**: Easy-to-use interface for both beginners and experts.
- **Export Options**: Export your designs for printing or sharing.

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **AI Services**: Dall-E AI Model
- **3D Rendering**: Three.js
- **Deployment**: Vercel

## Installation

1. **Clone the repository**
   ```sh
   git clone 
   
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application in action.

## Usage

1. **Design Your T-Shirt**
   - Choose a T-shirt template.
   - Use the AI-powered design suggestions or create your own design.
   - Customize the design with various tools and options.

2. **View in 3D**
   - Rotate, zoom, and pan the 3D model to view your design from different angles.
   - Make adjustments as needed for the perfect look.

3. **Export Your Design**
   - Save your design as an image file.
   - Share your design on social media or with friends.


iniciar servidor estatico y no tener que usar npm run dev

✅ 1. Instalar dependencias (solo la primera vez)
npm install

✅ 2. Hacer el build en ese computador
npm run build


Esto vuelve a generar la carpeta:

dist/

✅ 3. Instalar un servidor estático (una sola vez)
npm install -g serve

✅ 4. Servir la carpeta dist
serve dist


Y el navegador te mostrará algo como:

http://localhost:3000


Abres esa URL y tu editor 3D funciona sin npm run dev.