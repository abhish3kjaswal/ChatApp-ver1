const cloudinary = require('cloudinary');

const uploadImg = async (image, id) => {
    // return new Promise((resolve, reject) => {
    //     cloudinary.uploader.upload(
    //         image,
    //         { public_id: id },
    //         function (error, result) {
    //             if (result && result.secure_url)
    //                 return resolve(result.secure_url);
    //             return reject(error);
    //         }
    //     );
    // })



    return await cloudinary.v2.uploader.upload(image,
    { public_id: id }, 
    function(error, result) {
        if (result) {
            let url = result
            return url
        }
        else{
            return error
        }
    });
}

module.exports = uploadImg