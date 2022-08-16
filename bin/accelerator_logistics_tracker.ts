#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AcceleratorLogisticsTrackerStack } from '../lib/accelerator_logistics_tracker-stack';
import projectConfig = require('../configuration/projectConfig.json');

const app = new cdk.App();
new AcceleratorLogisticsTrackerStack(
    app,
    `AcceleratorLogisticsTrackerStack-${projectConfig.projectName}`, {
    projectName: projectConfig.projectName,
    repoType: projectConfig.repoType === 'git' ? 'git' : 'codecommit',
    git: projectConfig.git,
});

