const formSections = [
    {
        title: "Personal Information",
        fields: [
            { name: "fullName", type: "text", label: "Full Name" },
            { name: "dateOfBirth", type: "date", label: "Date of Birth" },
            { name: "address", type: "text", label: "Address" },
            { name: "maritalStatus", type: "select", label: "Marital Status", options: ["Single", "Married", "Registered Domestic Partnership", "Divorced", "Widowed"] }
        ]
    },
    {
        title: "Assets",
        fields: [
            { name: "realEstate", type: "textarea", label: "Real Estate Properties" },
            { name: "bankAccounts", type: "textarea", label: "Bank Accounts" },
            { name: "investments", type: "textarea", label: "Investments" },
            { name: "personalProperty", type: "textarea", label: "Personal Property" },
            { name: "communityProperty", type: "textarea", label: "Community Property (if married)" }
        ]
    },
    {
        title: "Beneficiaries",
        fields: [
            { name: "beneficiaries", type: "textarea", label: "Beneficiaries (Name, Relation, Allocated Assets)" }
        ]
    },
    {
        title: "Executor",
        fields: [
            { name: "executorName", type: "text", label: "Executor Name" },
            { name: "executorRelation", type: "text", label: "Relation" },
            { name: "alternateExecutor", type: "text", label: "Alternate Executor" }
        ]
    },
    {
        title: "Guardian for Minor Children",
        fields: [
            { name: "guardianName", type: "text", label: "Guardian Name" },
            { name: "alternateGuardian", type: "text", label: "Alternate Guardian" }
        ]
    },
    {
        title: "California-Specific Clauses",
        fields: [
            { name: "noContestClause", type: "checkbox", label: "Include a no-contest clause" },
            { name: "holographicWill", type: "checkbox", label: "This is a holographic will (entirely handwritten)" },
            { name: "communityPropertyAgreement", type: "checkbox", label: "Include community property agreement (if married)" },
            { name: "advancedHealthCareDirective", type: "checkbox", label: "Include reference to Advanced Health Care Directive" },
            { name: "pourOverWill", type: "checkbox", label: "This is a pour-over will (used with a living trust)" }
        ]
    }
];

let currentSection = 0;

function renderForm(section) {
    const container = document.getElementById('form-container');
    container.innerHTML = `<h2>${formSections[section].title}</h2>`;
    
    formSections[section].fields.forEach(field => {
        let fieldHtml = `<label for="${field.name}">${field.label}</label>`;
        if (field.type === "select") {
            fieldHtml += `<select id="${field.name}" name="${field.name}">
                ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>`;
        } else if (field.type === "textarea") {
            fieldHtml += `<textarea id="${field.name}" name="${field.name}"></textarea>`;
        } else if (field.type === "checkbox") {
            fieldHtml += `<input type="checkbox" id="${field.name}" name="${field.name}">`;
        } else {
            fieldHtml += `<input type="${field.type}" id="${field.name}" name="${field.name}">`;
        }
        container.innerHTML += fieldHtml;
    });
}

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentSection < formSections.length - 1) {
        currentSection++;
        renderForm(currentSection);
    }
    if (currentSection === formSections.length - 1) {
        document.getElementById('generate-will-btn').style.display = 'block';
    }
    updateButtonVisibility();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentSection > 0) {
        currentSection--;
        renderForm(currentSection);
    }
    document.getElementById('generate-will-btn').style.display = 'none';
    updateButtonVisibility();
});

document.getElementById('generate-will-btn').addEventListener('click', generateWill);

function updateButtonVisibility() {
    document.getElementById('prev-btn').style.display = currentSection === 0 ? 'none' : 'block';
    document.getElementById('next-btn').style.display = currentSection === formSections.length - 1 ? 'none' : 'block';
}

function generateWill() {
    // Collect all form data
    const formData = {};
    formSections.forEach(section => {
        section.fields.forEach(field => {
            if (field.type === "checkbox") {
                formData[field.name] = document.getElementById(field.name).checked;
            } else {
                formData[field.name] = document.getElementById(field.name).value;
            }
        });
    });

    // Generate will text
    const willText = `
    LAST WILL AND TESTAMENT OF ${formData.fullName.toUpperCase()}

    I, ${formData.fullName}, a resident of ${formData.address}, California, being of sound mind, declare this to be my Last Will and Testament.

    1. REVOCATION: I revoke all prior wills and codicils.

    2. MARITAL STATUS: I am ${formData.maritalStatus}.

    3. EXECUTOR: I appoint ${formData.executorName} as Executor of my estate. If they are unable or unwilling to serve, I appoint ${formData.alternateExecutor} as alternate Executor.

    4. DISTRIBUTION OF ESTATE:
    ${formData.beneficiaries}

    5. GUARDIAN FOR MINOR CHILDREN: I appoint ${formData.guardianName} as guardian for my minor children. If they are unable or unwilling to serve, I appoint ${formData.alternateGuardian} as alternate guardian.

    6. CALIFORNIA-SPECIFIC CLAUSES:
    ${formData.noContestClause ? "- No-Contest Clause: If any beneficiary contests this Will, they shall forfeit their entire share of the estate." : ""}
    ${formData.holographicWill ? "- This is a holographic will, entirely written, dated, and signed in my own handwriting." : ""}
    ${formData.communityPropertyAgreement ? "- Community Property Agreement: All community property shall pass to my surviving spouse." : ""}
    ${formData.advancedHealthCareDirective ? "- I have executed an Advanced Health Care Directive, which should be consulted for health care decisions." : ""}
    ${formData.pourOverWill ? "- This is a pour-over will. All assets not already in my living trust shall be transferred to the trust upon my death." : ""}

    7. ATTESTATION: I declare that I sign and execute this instrument as my last will, that I sign it willingly, and that I execute it as my free and voluntary act.

    Signed: ____________________
    Date: ______________________
    
    WITNESSES:
    We declare under penalty of perjury under the laws of California that the testator signed this document in our presence, and that we sign below as witnesses in the presence of the testator and each other.

    Witness 1: ____________________
    Witness 2: ____________________

    NOTE: This is a draft will generated by a web application. It should be reviewed and finalized by a legal professional before being considered valid.
    `;

    // Display the generated will
    const container = document.getElementById('form-container');
    container.innerHTML = `<h2>Generated California Will</h2><pre>${willText}</pre>`;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('prev-btn').style.display = 'none';
    document.getElementById('generate-will-btn').style.display = 'none';
}

// Initialize the first form section
renderForm(0);
updateButtonVisibility();
