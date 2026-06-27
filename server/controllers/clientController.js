import Client from "../models/Client.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
export const createClient =
    async (
        req,
        res,
        next
    ) => {

        try {

            const {

                name,
                companyName,
                email,
                phone,
                gstNumber,
                address,
                city,
                state,
                country,
                postalCode,

            } = req.body;

            if (!name || !email) {

                throw new ApiError(
                    400,
                    "Name and Email are required."
                );

            }

            const alreadyExists =
                await Client.findOne({
                    email,
                });

            if (alreadyExists) {

                throw new ApiError(
                    400,
                    "Client already exists."
                );

            }

            const client =
                await Client.create({

                    name,
                    companyName,
                    email,
                    phone,
                    gstNumber,
                    address,
                    city,
                    state,
                    country,
                    postalCode,

                });

            return res.status(201).json(

                new ApiResponse(

                    201,

                    "Client created successfully.",

                    client

                )

            );

        }

        catch (error) {

            next(error);

        }

    };

export const getClients =
    async (
        req,
        res,
        next
    ) => {

        try {

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 10;

            const skip =
                (page - 1) * limit;

            const search =
                req.query.search || "";

            const filter = {

                $or: [

                    {

                        name: {

                            $regex: search,

                            $options: "i",

                        },

                    },

                    {

                        email: {

                            $regex: search,

                            $options: "i",

                        },

                    },

                    {

                        companyName: {

                            $regex: search,

                            $options: "i",

                        },

                    },

                ],

            };

            const total =
                await Client.countDocuments(
                    filter
                );

            const clients =
                await Client.find(filter)

                    .sort({
                        createdAt: -1,
                    })

                    .skip(skip)

                    .limit(limit);

            return res.json(

                new ApiResponse(

                    200,

                    "Clients fetched successfully.",

                    {

                        clients,

                        total,

                        page,

                        totalPages:
                            Math.ceil(
                                total / limit
                            ),

                    }

                )

            );

        }

        catch (error) {

            next(error);

        }

    };

export const getClientById = async (req, res, next) => {
    try {

        const client = await Client.findById(req.params.id);

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        return res.json(
            new ApiResponse(
                200,
                "Client fetched successfully.",
                client
            )
        );

    } catch (error) {
        next(error);
    }
};

export const updateClient = async (req, res, next) => {

    try {

        const client = await Client.findById(req.params.id);

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        const {
            name,
            companyName,
            email,
            phone,
            gstNumber,
            address,
            city,
            state,
            country,
            postalCode,
        } = req.body;

        client.name = name ?? client.name;
        client.companyName = companyName ?? client.companyName;
        client.email = email ?? client.email;
        client.phone = phone ?? client.phone;
        client.gstNumber = gstNumber ?? client.gstNumber;
        client.address = address ?? client.address;
        client.city = city ?? client.city;
        client.state = state ?? client.state;
        client.country = country ?? client.country;
        client.postalCode = postalCode ?? client.postalCode;

        await client.save();

        return res.json(
            new ApiResponse(
                200,
                "Client updated successfully.",
                client
            )
        );

    } catch (error) {
        next(error);
    }

};



export const deleteClient = async (req, res, next) => {

    try {

        const client = await Client.findById(req.params.id);

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        await client.deleteOne();

        return res.json(
            new ApiResponse(
                200,
                "Client deleted successfully."
            )
        );

    } catch (error) {

        next(error);

    }

};