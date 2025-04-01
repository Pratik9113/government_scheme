import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const SchemeDetails = () => {
    const [activeTab, setActiveTab] = useState('details');

    const tabs = [
        { id: 'details', label: 'Details' },
        { id: 'benefits', label: 'Benefits' },
        { id: 'eligibility', label: 'Eligibility' },
        { id: 'application', label: 'Application Process' },
        { id: 'documents', label: 'Documents Required' },
        { id: 'faq', label: 'Frequently Asked Questions' },
        { id: 'sources', label: 'Sources And References' }
    ];

    const tags = ['Missing', 'Fisherman', 'Relief', 'Financial Assistance', 'Family'];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w mx-auto p-10">
                {/* Header */}
                <div className="mb-6">
                    <button className="flex items-center text-blue-600 mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <h1 className="text-xl md:text-2xl font-semibold mb-2">Puducherry</h1>
                    <h2 className="text-lg md:text-xl text-blue-600 font-medium mb-4">
                        "Immediate Relief Assistance" under "Welfare and Relief for Fishermen During Lean Seasons and Natural Calamities Scheme"
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mb-6 border-b">
                    <nav className="flex overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === 'details' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Details</h3>
                            <p className="text-gray-700">
                                The scheme "Immediate Relief Assistance" is a Sub-Component under the scheme "Welfare and Relief for Fishermen During Lean Seasons and Natural Calamities Scheme". The scheme is extended to all the regions of the Union territory of Puducherry. The scheme is introduced with the objective of extending financial assistance to the fishermen's families to compensate for the loss due to the missing breadwinner and to support them financially to run their family.
                            </p>
                        </div>
                    )}

                    {activeTab === 'benefits' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                            <p className="text-gray-700 mb-6">
                                ₹ 1,00,000, in two installments of ₹ 50,000 each, as immediate relief assistance for the family (legal heir) of the missing fisherman.
                            </p>

                            <h4 className="text-lg font-semibold mb-4">Disbursal</h4>
                            <ul className="space-y-3 text-gray-700">
                                <li>Initially, 50% will be extended within 3 months from the date of receipt of the application from the family (legal heir).</li>
                                <li>The family (legal heir) should approach this department for the release of the balance 50% of the relief which will be deposited in the bank in a joint account in the name of kin (legal heir) and the competent authority concerned.</li>
                                <li>If no further information is received about the missing person, the balance amount will be released in favour of the next of kin (legal heir), after the prescribed period of 9 months from the date of release of 1st part of lump sum.</li>
                            </ul>

                            <p className="mt-6 text-sm italic text-gray-600">
                                *In case of the return of the missing fishermen, the amount extended as compensation either ₹ 50,000 or ₹ 1,00,000 as the case may be, will be recovered by invoking an insurance bond.
                            </p>
                        </div>
                    )}

                    {activeTab === 'eligibility' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Eligibility</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li>The applicant should be the family (legal heir) of the missing fisherman.</li>
                                <li>The missing fisherman should have been a resident of the Union territory of Puducherry.</li>
                                <li>The missing fisherman must have lost his/her life while fishing.</li>
                                <li>The missing fisherman must have been in the age group of 18-60 years.</li>
                                <li>The missing fisherman must not have been a beneficiary of the old age pension scheme.</li>
                                <li>The missing fisherman should have enrolled as a member of the Fishermen/Fisherwomen Co-operative Society.</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'application' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Application Process</h3>
                            <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded mb-6">Offline</div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium mb-2">Step 1:</h4>
                                    <p className="text-gray-700">The interested applicant should visit the office of the concerned authority i.e. the Department of Fisheries and Fishermen Welfare/Sub-Offices of outlying regions in all four regions.</p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Step 2:</h4>
                                    <p className="text-gray-700">In the application form, fill in all the mandatory fields, paste the passport-sized photograph (signed across, if required), and attach copies of all the mandatory documents (self-attest, if required).</p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Step 3:</h4>
                                    <p className="text-gray-700">Submit the duly filled and signed application form along with the documents to the concerned authority.</p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Step 4:</h4>
                                    <p className="text-gray-700">Request a receipt or acknowledgment from the concerned authority to whom the application has been submitted. Ensure that the receipt contains essential details such as the date and time of submission, and a unique identification number (if applicable).</p>
                                </div>
                            </div>

                            <p className="mt-6 text-sm italic text-gray-600">
                                *The affected family (legal heir) should apply immediately within 30 days from the date of the event for consideration.
                            </p>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Documents Required</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li>Photograph of the Family (Legal Heir) of the Missing Fisherman.</li>
                                <li>Residential Certificate of the Missing Fishermen.</li>
                                <li>Proof of Age of the Missing Fishermen.</li>
                                <li>Declaration That the Missing Fisherman Was Not a Beneficiary of the Old Age Pension Scheme.</li>
                                <li>Membership Certificate from the President/Administrator of Fishermen/Fisherwoman Co-operative Society.</li>
                                <li>Electoral Identity Card (Attested Copy)</li>
                                <li>Ration Card (Attested Copy)</li>
                                <li>Panchayathar's Letter of Village Concerned</li>
                                <li>Name, Relationship, and Address of the Legal Heir (Affidavit in ₹ 5 Stamp Paper, Affixing as the Legal Heir Duly Signed in Before a Notary Public).</li>
                                <li>'No Claim' Certificate in Respect of Financial Assistance Extended by the Revenue Department Should Be Obtained From the Department of Revenue and Disaster Management.</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeDetails;