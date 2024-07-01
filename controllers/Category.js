const Category =require("../models/Category");
const {mongoose} = require("mongoose");

//create category ka handler
exports.createCategory = async(req,res)=>{
    try{
        //fetch data
        const {name, description} = req.body;
        //validation
        if(!name || !description  )
            {
                return res.status(400).json({
                    success:false,
                    message:'All field are required',
                });
            }
            //create entry in DB
            const CategorysDetails = await Category.create({
                name:name,
                description:description,
            });
            console.log(CategorysDetails);
            //return response
            return res.status(200).json({
                success:true,
                message:'Category created successfully',
            });


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
exports.showAllCategory = async(req,res)=>{
    try{
        const allCategorys = await Category.find({},{name:true,description});
        res.status(200).json({
            success:true,
            message:'All tags returned successfully',
            allCategorys,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
};

//category Page Details
exports.categoryPageDetails = async(req,res)=>{
    try{
        const{categoryId} = req.body;
        console.log("Printing Category Id : ",categoryId);
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path:"Course",
            match:{status : "Published"},
            populate : "ratingAndReviews",
        })
        .exec()

        //console.log(Selected course , )
        //handle the case when the category is not found
        if(!selectedCategory){
            console.log("Category not found.")
            return res.status(404).json({
                success:false,
                message:'Category Not Found',
            });
        }
        //Handle the case when there are no course
        if(selectedCategory.course.length === 0)
            {
                console.log("No course found for the selected Category ");
                return res.status(404).json({
                    success:false,
                    message:'No course found for the selected category',
                })
            }
            //get course for other categories
            const categoriesExceptSelected = await Category.find({
                _id:{$ne:categoryId},
            })
            let differentCategory = await Category.findOne(
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
            )
            .populate({
                path:"Course",
                match:{status:"Published"},

            })
            .exex()
            //console.log("Different course",different categiry)
            //get top selling course course across all categories
            const allCategories =await Category.find()
            .populate({
                path:"courses",
                match:{status:"Published"},
                populate:{
                    path:"instructor",
                },

            }).exec()
            const allCourse = allCategories.flatMap((Category)=>categoryId.courses)
            const mostSellingCourses = allCourse.sort((a,b)=>b.sold-a.sold)
            .slice(0,10)
            console.log("most Selling course COURSE",mostSellingCourse)
            res.status(200).json({
                success:true,
                data:{
                    selectedCategory,
                    differentCategory,
                    mostSellingCourses,
                }
            })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Internal server error',
            error:error.message,
        })

    }
}

