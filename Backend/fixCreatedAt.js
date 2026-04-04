import mongoose from "mongoose";
import User from "./models/User.js";

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:123@cluster0.yof6qdi.mongodb.net/?appName=Cluster0");

        const users = await User.find({ createdAt: { $exists: false } });

        console.log(`Found ${users.length} users without createdAt`);

        for (const user of users) {
            const date = user._id.getTimestamp();

            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        createdAt: date,
                        updatedAt: date,
                    },
                }
            );
        }

        console.log("Done updating users");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

run();