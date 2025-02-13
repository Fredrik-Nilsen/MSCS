// This file handles the functionality for the first page, including rendering the matrix of questions, capturing user responses, and navigating to the results page.

document.addEventListener("DOMContentLoaded", function() {
    const questions = [
        "Jeg utsetter ting",
        "Hvis det er noe jeg bør gjøre, gjør jeg det før jeg gjør andre og mindre viktige ting",
        "Jeg utsetter ting så lenge at det går ut over velvære og effektivitet",
        "Jeg bruker tiden min fornuftig",
        "Jeg har vanskelig for å komme i gang med ting",
        "Det er vanskelig for meg å konsentrere meg",
        "Jeg har god konsentrasjonsevne",
        "Jeg greier å konsentrere meg selv når det er mange forstyrrelser rundt meg",
        "Jeg er i stand til å regulere mitt fokus mens jeg holder på med en oppgave",
        "Jeg har problemer med å holde konsentrasjonen på det som blir sagt i en forelesning",
        "Kroppslige impulser har noen ganger for mye styring over meg",
        "Jeg forstyrres lett av mine impulser",
        "Jeg har noen ganger vansker med å sette grenser for meg selv",
        "Når jeg står overfor en uønsket fristelse, har jeg problemer med å slutte å tenke på den",
        "Jeg handler ofte uten å tenke gjennom alternativene",
        "Når en ubehagelig tanke plager meg, prøver jeg å tenke på noe annet",
        "Når jeg er nedfor, prøver jeg å tenke på noe positivt",
        "Når jeg er nedfor, prøver jeg å gjøre noe som jeg liker",
        "Hvis jeg blir sint, prøver jeg å fokusere på noe annet",
        "Når jeg setter meg et mål lager jeg som oftest konkrete planer for hvordan jeg skal nå det",
        "Jeg lager planer for når, hvor og hvordan jeg skal nå mine mål",
        "Jeg fokuserer daglig på mine langsiktige mål",
        "Jeg er klar over hva jeg må gjøre for å nå mine mål",
        "Når jeg er usikker på hvordan jeg skal løse en oppgave, forsøker jeg å gjøre et eller annet bare for å komme i gang",
        "Når jeg ikke kommer videre med en oppgave, prøver jeg å betrakte oppgaven på en annen måte",
        "Når jeg gjør noe som er skremmende, fokuserer jeg på hvordan jeg kan overvinne frykten",
        "Når det er vanskelig å komme i gang med en oppgave, prøver jeg å finne på noe som kan få meg i gang",
        "Når det er vanskelig for meg å konsentrere meg om hva jeg skal lese, forsøker jeg å finne måter jeg kan øke min konsentrasjon på",
        "Jeg ser ofte nye løsninger gjennom å redefinere situasjonen"
    ];

    const questionsTable = document.getElementById('questionsTable');

    questions.forEach((question, index) => {
        const tr = document.createElement('tr');
        const tdQuestion = document.createElement('td');
        tdQuestion.textContent = `${index + 1}. ${question}`;
        tr.appendChild(tdQuestion);

        for (let i = 1; i <= 7; i++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${index + 1}`;
            input.value = i;
            td.appendChild(input);
            tr.appendChild(td);
        }

        questionsTable.appendChild(tr);
    });

    // Handle form submission
    const form = document.getElementById('mcsForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate that all questions are answered
        let allAnswered = true;
        questions.forEach((_, index) => {
            const radios = document.getElementsByName(`q${index + 1}`);
            const isAnswered = Array.from(radios).some(radio => radio.checked);
            if (!isAnswered) {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            alert('Vennligst svar på alle spørsmål før du sender inn.');
            return;
        }

        // Collect the form data
        const formData = new FormData(form);
        const results = {};
        formData.forEach((value, key) => {
            results[key] = value;
        });

        console.log(results); // Log the results to the console (or handle them as needed)

        // Store results in localStorage or sessionStorage
        localStorage.setItem('mscsResults', JSON.stringify(results));

        // Redirect to results page
        window.location.href = 'results.html';
    });

    // Handle download of responses
    const downloadButton = document.getElementById('downloadResponses');
    downloadButton.addEventListener('click', function() {
        const responses = JSON.parse(localStorage.getItem('mscsResults'));
        if (!responses) {
            alert('Ingen besvarelser funnet.');
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8," + 
            Object.keys(responses).map(key => `${key},${responses[key]}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "mscs_responses.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
        document.body.removeChild(link);
    });
});
