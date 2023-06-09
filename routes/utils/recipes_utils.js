const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRandomRecipes(){
    const res = await axios.get(`${api_domain}/random`,{
        params:{
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    console.log(res)
    return res;
}

function extractPreviewRecipeDetails(recipes_info){
    return recipes_info.map((recipe_info) => {
        let data = recipe_info;
        if(recipe_info.data){
            data=recipe_info.data
        }
        let{
            recipe_id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
            instructions,
            analyzedInstructions,
            extendedIngredients,
        } = data;
        return {
            recipe_id:recipe_id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions,
            analyzedInstructions:analyzedInstructions,
            extendedIngredients: extendedIngredients,
        }
    })
}

async function getRandomThreeRecipes() {
    let randomRecipes = await getRandomRecipes();
    return extractPreviewRecipeDetails(randomRecipes.data.recipes)
}

async function getRecipesPreview(recipeIds_array) {
    let results = [];
    console.log(recipeIds_array)
    for (let index = 0; index < recipeIds_array.length; index++) {
        console.log(recipeIds_array[index]);
        results.push(await getRecipeDetails(recipeIds_array[index]));
    }
    return results;
}


exports.getRecipeDetails = getRecipeDetails;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.extractPreviewRecipeDetails = extractPreviewRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;


