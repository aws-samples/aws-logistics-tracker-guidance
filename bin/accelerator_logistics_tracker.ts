#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AcceleratorLogisticsTrackerStack, InfrastractureStackProps} from '../lib/accelerator_logistics_tracker-stack';
import projectConfig = require('../configuration/projectConfig.json');

const app = new cdk.App();

// noinspection TypeScriptValidateTypes
const stackProps: InfrastractureStackProps = {
    projectName: projectConfig.projectName,
    repoType: projectConfig.repoType === 'git' ? 'git' : 'codecommit',
    git: projectConfig.git,
};

new AcceleratorLogisticsTrackerStack(
    app,
    `AcceleratorLogisticsTrackerStack-${projectConfig.projectName}`,
    stackProps,
    description: "Reference for logistics tracking ML model pipeline ('uksb-1tsflhnco')",
);

