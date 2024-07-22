const Folder = require('../model/folder');

const getFolder = async(req,res)=>{
    try{
        const folders = await Folder.find();
        res.json({
            status:"SUCCESS",
            data:folders
        })

    }catch(error){
        res.status(500).json({
            status:'Failure',
            message:'Something went wrong'
        })

    }
};

const addFolder = async (req,res)=>{
    try{
        const {folderName} = req.body;
        if (!folderName) {
            return res.status(400).json({
                status: 'FAILURE',
                message: 'Folder name is required'
            });
        }
        const newFolder = new Folder({ folderName });
        await Folder.save();
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

const deleteFolder = async(re,res)=>{
    try{
        const {id} = re.params;
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
        res.status(500).json({
            status:"Falure",
            message:'Something went wrong'
        });
    }
}

module.exports = {getFolder,addFolder,deleteFolder};