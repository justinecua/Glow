let SearchResultsContainer = document.querySelector('.Search-Results-Container');
let NoResultsP = document.getElementById('No-ResultsP');

export function SearchResults(searchInfo) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', `/searchResults/?query=${encodeURIComponent(searchInfo)}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    console.log("Post successful: " + response.message);
                    let Queryresults = response.results;
                    let displayedTags = new Set(); 

                    Queryresults.forEach((result, index) => {
                        let ResultId = `Result-Search-${result.type}-${result.id}`;
                        let Result = document.getElementById(ResultId);

                        if (!Result) {
                            Result = document.createElement("div");
                            Result.className = "Result-Search";
                            Result.id = ResultId;

                            if (result.type === 'account') {
                                let name = document.createElement("p");
                                let ResultProf = document.createElement("img");
                                ResultProf.className = "ResultProf";
                                ResultProf.src = result.profile;

                                name.innerHTML = `${result.firstname} ${result.lastname}`;
                                Result.appendChild(ResultProf);
                                Result.appendChild(name);

                                Result.addEventListener('click', () => {
                                    window.location.href = `/profile/${result.id}`;
                                });
                            } else if (result.type === 'tag') {
                                if (!displayedTags.has(result.tag)) {
                                    let tag = document.createElement("span");
                                    tag.className = "tag";
                                    tag.innerHTML = "#" + result.tag;

                                    Result.appendChild(tag);
                                    
                                    Result.addEventListener('click', () => {
                                        window.location.href = `/tags/${result.id}`;
                                    });

                                    displayedTags.add(result.tag);
                                }
                            }
                            SearchResultsContainer.appendChild(Result);
                        }
                    });
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    xhr.send();
}
