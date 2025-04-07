import React from 'react'
import GovernmentSchemesSlider from './SideScroll';
import AgriTechSteps from './StepWise';
import DigiKissanFooter from './DashboardFooter';
import MySchemeAbout from './DashboardScheme';

const Dashboard = () => {
    return (
        <>
            <GovernmentSchemesSlider />
            <MySchemeAbout />
            <AgriTechSteps />
            <DigiKissanFooter />
        </>
    )
}

export default Dashboard;