import ProductModel from "../models/productmodel.js"

export const addproduct = async (req, res) => {
    try {
        if (!req.body.productname || !req.body.price || !req.body.discount || !req.body.originalprice || !req.body.category || !req.body.stock || !req.body.description || !req.body.imageurl) {
            return res.status(400).send({
                message: "Send ALL required Fields!"
            })
        }
        const newproduct = {
            productname: req.body.productname,
            price: req.body.price,
            discount: req.body.discount,
            originalprice: req.body.originalprice,
            category: req.body.category,
            stock: req.body.stock,
            description: req.body.description,
            imageurl: req.body.imageurl
        }
        const product = await ProductModel.create(newproduct)
        res.status(201).send(product)
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ message: err.message })
    }
}

export const getproduct = async (req, res) => {
    try {
        const product = await ProductModel.find({})
        if (!product) {
            res.status(404).send({
                message: "product not found"
            })
        }
        if (product.length < 0) {
            res.status(404).send({
                message: "there are no product in here",
            })
        }
        res.status(201).json({
            message: "All product get successfully",
            count: product.length,
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const getsingleproduct = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const singleproduct = await ProductModel.findById(id)

        if (!singleproduct) {
            res.status(404).send({
                message: "product not found"
            })
        }
        res.status(201).json({
            message: "get the product successfully",
            data: singleproduct
        })
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const updateproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateproduct = await ProductModel.findByIdAndUpdate(id, req.body)
        
        if (!updateproduct) {
            res.status(404).json({
                message: 'product is not found'
            })
        } else {
            res.status(200).json({
                message: "product update successfully",
                data: updateproduct
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const deleteproduct = async (req, res) => {
    try {
        const { id } = req.params
        const deleteproduct = await ProductModel.findByIdAndDelete(id)
        if (!deleteproduct) {
            res.status(404).json({
                message: "product not found"
            })
        } else {
            res.status(200).json({ message: "product deleted successfully" })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}