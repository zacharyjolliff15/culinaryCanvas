document.addEventListener('DOMContentLoaded', function() {
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsData.forEach(row => {
        const li = document.createElement('li');
        li.textContent = row.ingredients; // Assuming 'ingredients' is the property name
        ingredientsList.appendChild(li);
    });
});
