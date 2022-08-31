# Crear paquetes npm con componentes de React

### Paso 1

Inicia un paquete npm:

```
npm init
```

### Paso 2

Crea las siguientes carpetas en la main del proyecto:

```
build
src
test
```

### Paso 3

Instala los siguientes paquetes como dependencias de desarrollo:

```
npm i -D rollup rollup-plugin-copy rollup-plugin-terser @rollup/plugin-babel @babel/cli @babel/core @babel/preset-env @babel/preset-react
```

### Paso 4

Crea una aplicación de react dentro de la carpeta test:

```
npx create-react-app test
```

### Paso 5

Crea tu componente en la carpeta src y después procederemos a linkearlo con la aplicación de react creada dentro de la carpeta **test** para poder ir viendo el desarrollo correcto del componente.

```javascript
import React from "react";

const MyComponent = () => {
    return <>This es my component</>;
};

export default MyComponent;
```

### Paso 6

Linkea tu componente con la aplicación de react que está en la carpeta test. Ten en cuenta que si instalas algún paquete en la aplicación de react de test, tendrás que volver a hacer el proceso de linkeo.

Para linkear el componente en la carpeta raiz añadimos el componente al ámbito global:

```
npm link
```

Seguidamente entramos en la carpeta test y lo linkeamos

```
cd test
npm link component-name
```

Ten en cuenta el el **_component_name_** es el nombre que el componente tiene en el **package.json**

### Paso 7

En una ventana del terminal en la carpeta raiz del componente ejectua el script de watch de webpack, para que conforme vayamos modificando el componente se vaya actualizando en la carpeta **build**.

```
npm start
```

En otra ventana del terminal, en la carpeta **test**, ejecuta la aplicación de react y añade tu componente a al **src/App.js** para empezar a editarlo.

```
cd test
npm start
```

### Paso 8

Una vez el componente esté finalizado, podremos publicarlo en npm. Te presente de configurar correctamente tanto el **package.json** así como los archivos de .gitignore y .npmignore.
