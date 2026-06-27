import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({
            admin: req.user._id,
        });

        if (!settings) {
            settings = await Settings.create({
                admin: req.user._id,
            });
        }

        return res.status(200).json({
            success: true,
            data: settings,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const updateSettings = async (req, res) => {
    try {
        const { business, tax, invoice, quote } = req.body;

        const settings = await Settings.findOneAndUpdate(
            { admin: req.user._id },
            {
                $set: {
                    ...(business && { business }),
                    ...(tax && { tax }),
                    ...(invoice && { invoice }),
                    ...(quote && { quote }),
                },
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};