import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {DataSourceConstruct} from "./dataSourceConstruct";
import {SageMakerConstruct} from "./sageMakerConstruct";
import {
    CodePipelineConstruct,
    CodePipelineConstructProps,
    CodePipelineConstructPropsBase
} from "./codePipelineConstruct";

export type InfrastractureStackProps = CodePipelineConstructPropsBase & StackProps;

export class AcceleratorLogisticsTrackerStack extends Stack {
    constructor(scope: Construct, id: string, props?: InfrastractureStackProps) {
        super(scope, id, props);

        const dataSource = new DataSourceConstruct(this, 'DataSource');

        const sageMaker = new SageMakerConstruct(this, 'SageMakerConstruct', {
            dataBucket: dataSource.dataBucket,
        });

        const codePipeline = new CodePipelineConstruct(this, 'CodePipeline', <CodePipelineConstructProps>{
            ...props,
            dataManifestBucket: dataSource.dataManifestBucket,
            sageMakerArtifactBucket: sageMaker.sagemakerArtifactBucket,
            sageMakerExecutionRole: sageMaker.sagemakerExecutionRole
        });

        new CfnOutput(this, 'CodePipelineOutput', {
            value: codePipeline.pipeline.pipelineName,
        });

        new CfnOutput(this, 'DataBucketOutput', {
            value: dataSource.dataBucket.bucketName,
            exportName: 'LogisticsTracker-DataBucket',
        });

        new CfnOutput(this, 'DataManifestBucketOutput', {
            value: dataSource.dataManifestBucket.bucketName,
        });

        new CfnOutput(this, 'SageMakerArtifactBucketOutput', {
            value: sageMaker.sagemakerArtifactBucket.bucketName,
            exportName: 'LogisticsTracker-SageMakerArtifactBucket',
        });

        new CfnOutput(this, 'SageMakerExecutionRoleOutput', {
            value: sageMaker.sagemakerExecutionRole.roleArn,
            exportName: 'LogisticsTracker-SageMakerExecutionRole',
        });
    }
}
