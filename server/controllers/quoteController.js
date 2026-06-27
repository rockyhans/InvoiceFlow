import Quote from "../models/Quote.js";
import Client from "../models/Client.js";

const generateQuoteNumber = async () => {
    const count = await Quote.countDocuments();
    return `QT-${String(count + 1).padStart(5, "0")}`;
};

export const createQuote = async (req, res, next) => {
    try {
        const {
            client,
            issueDate,
            expiryDate,
            items,
            discount = 0,
            tax = 0,
            notes = "",
            status = "Draft"
        } = req.body;


        const discountNum = Number(discount) || 0;
        const taxNum = Number(tax) || 0;

        const existingClient = await Client.findById(client);

        if (!existingClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        let subtotal = 0;

        const formattedItems = items.map((item) => {
            const amount = Number(item.quantity) * Number(item.price);
            subtotal += amount;

            return {
                ...item,
                amount
            };
        });

        const total = subtotal + taxNum - discountNum;
        const quote = await Quote.create({
            admin: req.user._id,
            quoteNumber: await generateQuoteNumber(),
            client,
            issueDate,
            expiryDate,
            items: formattedItems,
            subtotal,
            discount: discountNum,
            tax: taxNum,
            total,
            notes,
            status
        });

        res.status(201).json({
            success: true,
            data: quote
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Get All Quotes
 * GET /api/quotes
 */
export const getQuotes = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const keyword = req.query.search
            ? {
                quoteNumber: {
                    $regex: req.query.search,
                    $options: "i",
                },
            }
            : {};

        // const total = await Quote.countDocuments(keyword);

        // const quotes = await Quote.find(keyword)
        //     .populate("client")
        //     .sort({ createdAt: -1 })
        //     .skip(skip)
        //     .limit(limit);

        const filter = {
            admin: req.user._id,
            ...keyword,
        };

        const total = await Quote.countDocuments(filter);

        const quotes = await Quote.find(filter)
            .populate("client")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: quotes,
        });

    } catch (error) {

        next(error);

    }

};


export const getQuoteById = async (req, res, next) => {

    try {

        // const quote = await Quote.findById(req.params.id)
        //     .populate("client");

        const quote = await Quote.findOne({
            _id: req.params.id,
            admin: req.user._id,
        }).populate("client");

        if (!quote) {

            return res.status(404).json({
                success: false,
                message: "Quote not found",
            });

        }

        res.json({
            success: true,
            data: quote,
        });

    } catch (error) {

        next(error);

    }

};


export const updateQuote = async (req, res, next) => {

    try {

        // const quote = await Quote.findById(req.params.id);

        const quote = await Quote.findOne({
            _id: req.params.id,
            admin: req.user._id,
        }).populate("client");

        if (!quote) {

            return res.status(404).json({
                success: false,
                message: "Quote not found",
            });

        }

        const {
            client,
            issueDate,
            expiryDate,
            items,
            discount = 0,
            tax = 0,
            notes,
            status,
        } = req.body;

        const discountNum = Number(discount) || 0;
        const taxNum = Number(tax) || 0;

        let subtotal = 0;

        const updatedItems = items.map((item) => {
            const amount = Number(item.quantity) * Number(item.price);
            subtotal += amount;
            return { ...item, amount };
        });


        quote.client = client;
        quote.issueDate = issueDate;
        quote.expiryDate = expiryDate;
        quote.items = updatedItems;
        quote.subtotal = subtotal;
        quote.discount = discountNum;
        quote.tax = taxNum;
        quote.total = subtotal + taxNum - discountNum;
        quote.notes = notes;
        quote.status = status;

        await quote.save();

        res.json({
            success: true,
            data: quote,
        });

    } catch (error) {

        next(error);

    }

};


export const deleteQuote = async (req, res, next) => {

    try {

        // const quote = await Quote.findById(req.params.id);
        const quote = await Quote.findOne({
            _id: req.params.id,
            admin: req.user._id,
        });

        if (!quote) {

            return res.status(404).json({
                success: false,
                message: "Quote not found",
            });

        }

        await quote.deleteOne();

        res.json({
            success: true,
            message: "Quote deleted successfully",
        });

    } catch (error) {

        next(error);

    }

};