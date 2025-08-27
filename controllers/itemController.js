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

export async function updateItem(req, res) {

    //check if logged
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized! Please log in." });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden! Only admin can update items 🤨" });
    }

    const { itemCode } = req.params;
    if (!itemCode) {
        return res.status(400).json({ message: "Item code is required to update an item 😕" });
    }

    // Filter only allowed fields
    const allowedFields = ["price", "itemCode", "itemName", "itemPic", "rentPrice", "category", "availability"];
    const updateFields = {};
    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    }

    try {
        const updatedItem = await Item.findOneAndUpdate(
            { itemCode },
            updateFields,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found 😢" });
        }

        res.status(200).json({ message: "Item updated successfully 🦹", item: updatedItem });
    } catch (error) {
        console.error("Error updating item:", error.message);
        res.status(500).json({ message: "Internal Server Error 🚫" });
    }
}

export async function deleteItem(req, res) {
    //check if logged
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized! Please log in." });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden! Only admin can delete items 🤨" });
    }

    const { itemCode } = req.params;
    if (!itemCode) {
        return res.status(400).json({ message: "Item code is required to delete an item 😕" });
    }

    try {
        const deletedItem = await Item.findOneAndDelete({ itemCode });

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found 😢" });
        }

        res.status(200).json({ message: "Item deleted successfully 🦹", item: deletedItem });
    } catch (error) {
        console.error("Error deleting item:", error.message);
        res.status(500).json({ message: "Internal Server Error 🚫" });
    }
}