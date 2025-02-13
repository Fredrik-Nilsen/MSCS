// This file processes the responses from the test, applies the reversal logic for specific questions, calculates the averages for each category, and displays the summarized results on the results page.

document.addEventListener("DOMContentLoaded", function() {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsChart = document.getElementById('resultsChart').getContext('2d');
    const results = JSON.parse(localStorage.getItem('mscsResults'));

    if (results) {
        const reversedQuestions = [1, 3, 5, 6, 10, 11, 12, 13, 14, 15];
        const reverseValue = value => 8 - value; // Reversering: 1=7, 2=6, 3=5, 4=4, 5=3, 6=2, 7=1

        const categories = {
            Prokrastinering: [1, 2, 3, 4, 5],
            Konsentrasjon: [6, 7, 8, 9, 10],
            Impulser: [11, 12, 13, 14, 15],
            Emosjoner: [16, 17, 18, 19],
            Målorientering: [20, 21, 22, 23],
            Selvkontrollstrategier: [24, 25, 26, 27, 28, 29],
            Inhibering: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            Initiering: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            Selvkontroll: Array.from({ length: 29 }, (_, i) => i + 1),
        };

        const calculateAverage = (questions) => {
            const total = questions.reduce((sum, q) => {
                const value = parseInt(results[`q${q}`], 10);
                return sum + (reversedQuestions.includes(q) ? reverseValue(value) : value);
            }, 0);
            return (total / questions.length).toFixed(2);
        };

        const categoryAverages = {};
        for (const [category, questions] of Object.entries(categories)) {
            categoryAverages[category] = calculateAverage(questions);
        }

        const ul = document.createElement('ul');
        for (const [category, average] of Object.entries(categoryAverages)) {
            const li = document.createElement('li');
            li.textContent = `${category}: ${average}`;
            ul.appendChild(li);
        }
        resultsContainer.appendChild(ul);

        // Define colors for the chart
        const backgroundColors = Object.keys(categoryAverages).map(category => {
            if (category === 'Inhibering' || category === 'Initiering') {
                return 'rgba(54, 162, 235, 0.6)'; // Darker blue
            } else if (category === 'Selvkontroll') {
                return 'rgba(54, 162, 235, 0.8)'; // Even darker blue
            } else {
                return 'rgba(75, 192, 192, 0.2)'; // Default color
            }
        });

        const borderColors = Object.keys(categoryAverages).map(category => {
            if (category === 'Inhibering' || category === 'Initiering') {
                return 'rgba(54, 162, 235, 1)'; // Darker blue
            } else if (category === 'Selvkontroll') {
                return 'rgba(54, 162, 235, 1)'; // Even darker blue
            } else {
                return 'rgba(75, 192, 192, 1)'; // Default color
            }
        });

        // Create the chart
        new Chart(resultsChart, {
            type: 'bar',
            data: {
                labels: Object.keys(categoryAverages),
                datasets: [{
                    label: 'Gjennomsnittlig skår',
                    data: Object.values(categoryAverages),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7
                    }
                }
            }
        });
    } else {
        resultsContainer.textContent = 'No results found.';
    }
});