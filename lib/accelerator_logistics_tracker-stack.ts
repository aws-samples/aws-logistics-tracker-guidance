import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {DataSourceConstruct} from "./dataSourceConstruct";
import {SageMakerConstruct} from "./sageMakerConstruct";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";

export interface SageMakerConstructsProps {
  readonly dataManifestBucket: Bucket;
  readonly sageMakerArtifactBucket: Bucket;
  readonly sageMakerExecutionRole: Role;
}

export class AcceleratorLogisticsTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dataSource = new DataSourceConstruct(this, 'DataSource');

    const sageMakerReturnItems: SageMakerConstructsProps = new SageMakerConstruct(this, 'SageMakerConstruct', {
      dataBucket: dataSource.dataBucket,
    });

    const mlPipelineRole = new Role(this, 'MLPipelineRole', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
    });

    const mlPipelineProject = new codebuild.PipelineProject(this, 'MLPipeline', {
      buildSpec: codebuild.BuildSpec.fromSourceFilename('./buildspecs/pipeline.yml'),
      role: mlPipelineRole,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
    });

    const mlPipeline = new codepipeline_actions.CodeBuildAction({
      actionName: 'MLPipeline',
      project: mlPipelineProject,
      input: buildOutput,
      outputs: [pipelineOutput],
      environmentVariables: {
        SAGEMAKER_ARTIFACT_BUCKET: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: props.sageMakerArtifactBucket.bucketName,
        },
        SAGEMAKER_PIPELINE_ROLE_ARN: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: props.sageMakerExecutionRole.roleArn,
        },
        SAGEMAKER_PROJECT_NAME: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: props.projectName,
        },
      },
    });
  }
}
