import path from  "path"
const getImagePath  =(image)=>{
   return  path.join("uploads",image)
}

export {getImagePath}