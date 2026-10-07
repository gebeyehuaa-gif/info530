const handleButtonClick = () => {
	const input = document.getElementById("my_input");
	const inputMessage = document.getElementById("input_message");
	const results = document.getElementById("interest_results");
	const rawInput = input.value.trim();
	const interests = rawInput
		.split(",")
		.map((interest) => interest.trim())
		.filter((interest) => interest.length > 0);

	results.replaceChildren();
	inputMessage.textContent = "";

	if (rawInput.length === 0) {
		inputMessage.textContent = "Please enter at least one interest.";
		return;
	}

	if (!rawInput.includes(",") && /\s/.test(rawInput)) {
		inputMessage.textContent = "Please separate multiple interests with commas.";
		return;
	}

	if (interests.length > 0) {
		const title = document.createElement("strong");
		title.textContent = "Your Interests";
		results.appendChild(title);

		const interestList = document.createElement("ul");
		interests.forEach((interest) => {
			const listItem = document.createElement("li");
			listItem.textContent = interest;
			interestList.appendChild(listItem);
		});
		results.appendChild(interestList);
	}
};

const button = document.getElementById("search_button");
if (button) {
	button.addEventListener("click", (event) => {
		event.preventDefault();
		handleButtonClick();
	});
}
