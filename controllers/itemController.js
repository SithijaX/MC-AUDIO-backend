import Item from "../models/item.js";

export async function addItem(req,res) {
    try {
        //only admin can add item
        if(!req.user || req.user.role !== "admin") {
            return res.status(403).json({message: "Forbidden! Only admin can add items 🤨"});
        }

        const {itemCode, itemName, itemPic, rentPrice, category, availability} = req.body;

        // Validate required fields
        if (!itemCode || !itemName || !rentPrice || !category) {
            return res.status(400).json({ message: "Missing required fields 😕" });
        }

        // Check for existing item with the same itemCode
        const existingItem = await Item.findOne({ itemCode });
        if (existingItem) {
            return res.status(409).json({ message: "Item with this code already exists 😒" });
        }

        const newItem = new Item({
            itemCode,
            itemName,
            availability,
            itemPic: itemPic || "",
            rentPrice,
            category
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully 🦹", item: newItem });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Internal Server Error 😵" });
    }
}


export async function getItems(req, res) {
    try {
        const items = await Item.find();
        res.status(200).json({ items });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal Server Error 😵" });
    }
}