import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    agregarProducto = async (product) => {
        try {
            const products = await this.obtenerProductos();

            // Validar campos
            if (
                !product.titulo ||
                !product.descripcion ||
                !product.precio ||
                !product.categoria ||
                !product.codigo ||
                !product.existencias
            ) {
                return "Complete todos los campos";
            }

            const codigoRepetido = products.find((p) => p.codigo === product.codigo);

            if (codigoRepetido) {
                return "El código insertado ya existe";
            }

            // Generar el ID y agregar el producto
            const newProduct = {
                ...product,
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1
            };

            products.push(newProduct);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );

            return newProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Error al crear el producto", error);
        }
    };

    actualizarProducto = async (updatedProduct) => {
        try {
            const products = await this.leerProductos();
            const productoBuscado = products.find((p) => p.id === updatedProduct.id);

            if (!productoBuscado) {
                return `No se puede encontrar el producto con el id: ${updatedProduct.id}`;
            }

            const indexOfProduct = products.findIndex((p) => p.id === updatedProduct.id);
            products[indexOfProduct] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"), "utf8");

            return updatedProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Error al actualizar el producto", error);
        }
    };

    leerProductos = async () => {
        let resultado = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(resultado);
    };

    obtenerProductos = async () => {
        try {
            if (fs.existsSync(this.path)) {
                return await this.leerProductos();
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener los productos", error);
        }
    };

    obtenerProductosPorId = async (id) => {
        try {
            let todosProductos = await this.leerProductos();
            let idProducto = todosProductos.find((productos) => productos.id === id);
            if (idProducto) {
                return idProducto;
            } else {
                return "No Existe el producto";
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener el producto por ID", error);
        }
    };

    eliminarProductosPorId = async (id) => {
        try {
            const products = await this.leerProductos();
            const index = products.findIndex((p) => p.id === id);

            if (index < 0) {
                return `No se encuentra el producto con el id: ${id}`;
            }
            products.splice(index, 1);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );

            return products;
        } catch (error) {
            console.log(error);
            throw new Error("Error al eliminar el producto por ID", error);
        }
    }
}
