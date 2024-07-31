const Folder = require('../model/folder');

const getFolder = async (req, res) => {
    try {
        const userId = req.refUserId;
        console.log('User ID:', userId);

        if (!userId) {
            return res.status(400).json({ status: 'FAILURE', message: 'User ID is missing' });
        }

        const folders = await Folder.find({ userId: userId });

        if (!folders.length) {
            return res.status(404).json({ status: 'FAILURE', message: 'No folders found for this user' });
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: folders
        });

    } catch (error) {
        console.error('Error in getFolder:', error);
        
        if (!res.headersSent) {
            return res.status(500).json({
                status: 'FAILURE',
                message: 'Something went wrong'
            });
        }
    }
};


const allFolders = async(req,res)=>{
    try{
        const folders = await Folder.find();
        res.json({
            status:"SUCCESS",
            data:folders
        })

    }catch(error){
        console.error('Error in getFolder:', error);
        res.status(500).json({
            status:'Failure',
            message:'Something went wrong'
        })

    }
};

const addFolder = async (req,res)=>{
    
    try{
        const {folderName,userId} = req.body;
        if (!folderName) {
            return res.status(400).json({
                status: 'FAILURE',
                message: 'Folder name is required'
            });
        }
        const newFolder = new Folder({ folderName,userId });
        await newFolder.save();
        res.json({
            status: "SUCCESS",
            message: 'Folder created successfully',
            data:newFolder
        });

    }catch(error){
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });

    }

}

const deleteFolder = async(req,res)=>{
    try{
        const {id} = req.params
        const folder = await Folder.findByIdAndDelete(id);

        if(!folder){
            return res.status(404).json({
                status:'Failure',
                message:'Folder not found'
            });
        }

        res.json({
            status:'SUCCESS',
            message:'Folder deleted Successfully'
        })
    }catch(error){
        console.error('Error deleting folder:', error);
        res.status(500).json({
            status:"Falure",
            message:'Something went wrong'
        });
    }
}

module.exports = {getFolder,addFolder,deleteFolder,allFolders};