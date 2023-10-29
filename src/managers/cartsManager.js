import fs from "fs";

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    agregarAlCarrito = async (productId) => {
        try {
            if (fs.existsSync(this.path)) {
                const cartData = await fs.promises.readFile(this.path, 'utf-8');
                this.carts = JSON.parse(cartData);
            }

            this.carts.push(productId);

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));

            return this.carts;
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            throw new Error("Error al agregar al carrito");
        }
    }

    eliminarDelCarrito = async (productId) => {
        try {
            if (fs.existsSync(this.path)) {
                const cartData = await fs.promises.readFile(this.path, 'utf-8');
                this.carts = JSON.parse(cartData);
            }

            const index = this.carts.indexOf(productId);
            if (index > -1) {
                this.carts.splice(index, 1);
            }

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));

            return this.carts;
        } catch (error) {
            console.error("Error al eliminar del carrito:", error);
            throw new Error("Error al eliminar del carrito");
        }
    }
}
