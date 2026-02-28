const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

exports.createService = async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.seedServices = async (req, res) => {
    try {
        // For prototype: Clear existing to ensure we get the latest Telangana updates
        await Service.deleteMany({});

        const services = [
            {
                title: 'Aasara Pension',
                titleTe: 'ఆసరా పెన్షన్',
                description: 'Monthly pension for senior citizens, widows, and disabled persons.',
                descriptionTe: 'వృద్ధులు, వితంతువులు మరియు దివ్యాంగులకు నెలవారీ పెన్షన్.',
                category: 'State',
                requiredDocuments: ['Aadhaar Card', 'Proof of Age', 'Bank Passbook', 'Passport Size Photo', 'Food Security Card (Ration Card)'],
                formFields: [
                    { name: 'pensionType', label: 'Pension Type (Old Age/Widow/Disabled)', type: 'text', required: true },
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'age', label: 'Age', type: 'number', required: true },
                    { name: 'bankAccountNo', label: 'Bank Account Number', type: 'text', required: true },
                    { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
                    { name: 'selfDeclaration', label: 'I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief.', type: 'checkbox', required: true }
                ],
                icon: '👴'
            },
            {
                title: 'Rythu Bandhu',
                titleTe: 'రైతు బంధు',
                description: 'Investment support scheme for farmers.',
                descriptionTe: 'రైతులకు పెట్టుబడి సహాయ పథకం.',
                category: 'State',
                requiredDocuments: ['Pattadar Passbook', 'Aadhaar Card', 'Bank Passbook', 'Land Ownership Records'],
                formFields: [
                    { name: 'pattadarPassbookNo', label: 'Pattadar Passbook Number', type: 'text', required: true },
                    { name: 'surveyNo', label: 'Survey Number', type: 'text', required: true },
                    { name: 'totalAcres', label: 'Total Acres', type: 'number', required: true },
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'bankAccountNo', label: 'Bank Account Number', type: 'text', required: true },
                    { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true }
                ],
                icon: '🌾'
            },
            {
                title: 'Kalyana Lakshmi / Shaadi Mubarak',
                titleTe: 'కళ్యాణ లక్ష్మి / షాదీ ముబారక్',
                description: 'Financial assistance for marriage of girls from poor families.',
                descriptionTe: 'పేద కుటుంబాలలోని అమ్మాయిల వివాహానికి ఆర్థిక సహాయం.',
                category: 'State',
                requiredDocuments: ['Bride Aadhaar', 'Groom Aadhaar', 'Bride Age Proof', 'Income Certificate', 'Bride Bank Passbook', 'Mother Bank Passbook', 'Marriage Confirmation Certificate'],
                formFields: [
                    { name: 'brideName', label: 'Bride Name', type: 'text', required: true },
                    { name: 'groomName', label: 'Groom Name', type: 'text', required: true },
                    { name: 'brideDob', label: 'Bride Date of Birth', type: 'date', required: true },
                    { name: 'marriageDate', label: 'Date of Marriage', type: 'date', required: true },
                    { name: 'religion', label: 'Religion (Hindu/Muslim/Christian/Other)', type: 'text', required: true },
                    { name: 'incomeCertificateNo', label: 'Income Certificate Number', type: 'text', required: true }
                ],
                icon: '💍'
            },
            {
                title: 'Dalit Bandhu',
                titleTe: 'దళిత బంధు',
                description: 'Financial assistance for Dalit families to set up business.',
                descriptionTe: 'దళిత కుటుంబాలకు వ్యాపారం పెట్టుకోవడానికి ఆర్థిక సహాయం.',
                category: 'State',
                requiredDocuments: ['Caste Certificate', 'Aadhaar Card', 'Bank Passbook', 'Residence Proof', 'Income Certificate'],
                formFields: [
                    { name: 'casteCertificateNo', label: 'Caste Certificate Number', type: 'text', required: true },
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'businessProposal', label: 'Proposed Business Activity', type: 'text', required: true },
                    { name: 'bankAccountNo', label: 'Bank Account Number', type: 'text', required: true }
                ],
                icon: '🤝'
            },
            {
                title: 'PM Kisan Samman Nidhi',
                titleTe: 'పీఎం కిసాన్ సమ్మాన్ నిధి',
                description: 'Central sector scheme with 100% funding from Government of India.',
                descriptionTe: 'భారత ప్రభుత్వం నుండి 100% నిధులతో కేంద్ర రంగ పథకం.',
                category: 'Central',
                requiredDocuments: ['Aadhaar Card', 'Land Ownership Documents (Khata/Khasra)', 'Bank Passbook'],
                formFields: [
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'landRecordNo', label: 'Land Record Number', type: 'text', required: true },
                    { name: 'mobileNo', label: 'Mobile Number', type: 'text', required: true }
                ],
                icon: '🇮🇳'
            },
            {
                title: 'Ayushman Bharat',
                titleTe: 'ఆయుష్మాన్ భారత్',
                description: 'National Health Protection Scheme.',
                descriptionTe: 'జాతీయ ఆరోగ్య రక్షణ పథకం.',
                category: 'Central',
                requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
                formFields: [
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'rationCardNo', label: 'Ration Card Number', type: 'text', required: true },
                    { name: 'mobileNo', label: 'Mobile Number', type: 'text', required: true }
                ],
                icon: '🏥'
            },
            {
                title: 'Pradhan Mantri Awas Yojana',
                titleTe: 'ప్రధాన మంత్రి ఆవాస్ యోజన',
                description: 'Housing for All by 2022.',
                descriptionTe: '2022 నాటికి అందరికీ ఇళ్లు.',
                category: 'Central',
                requiredDocuments: ['Aadhaar Card', 'Income Proof (Salary Slip/ITR)', 'Property/Land Details', 'Bank Passbook'],
                formFields: [
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'annualIncome', label: 'Annual Income', type: 'number', required: true },
                    { name: 'ownershipStatus', label: 'Existing House Ownership (Yes/No)', type: 'text', required: true }
                ],
                icon: '🏠'
            },
            {
                title: 'Ration Card Application',
                titleTe: 'రేషన్ కార్డు దరఖాస్తు',
                description: 'Apply for new Food Security Card.',
                descriptionTe: 'కొత్త ఆహార భద్రత కార్డు కోసం దరఖాస్తు.',
                category: 'State',
                requiredDocuments: ['Aadhaar Card', 'Gas Connection Details', 'Income Certificate', 'Address Proof'],
                formFields: [
                    { name: 'headOfFamily', label: 'Head of Family Name', type: 'text', required: true },
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true },
                    { name: 'annualIncome', label: 'Annual Family Income', type: 'number', required: true },
                    { name: 'gasConnectionNo', label: 'Gas Connection Number (if any)', type: 'text', required: false }
                ],
                icon: '🍚'
            },
            {
                title: 'Community & Caste Certificate',
                titleTe: 'కుల ధృవీకరణ పత్రం',
                description: 'Apply for Caste/Community certificate.',
                descriptionTe: 'కుల ధృవీకరణ పత్రం కోసం దరఖాస్తు.',
                category: 'State',
                requiredDocuments: ['Aadhaar Card', 'Ration Card', 'School TC/Bonafide'],
                formFields: [
                    { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
                    { name: 'fatherName', label: 'Father Name', type: 'text', required: true },
                    { name: 'casteClaimed', label: 'Caste Claimed', type: 'text', required: true },
                    { name: 'aadhaarNo', label: 'Aadhaar Number', type: 'text', required: true }
                ],
                icon: '📜'
            }
        ];

        await Service.insertMany(services);
        res.json({ message: 'Services seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error ' + error.message });
    }
};
