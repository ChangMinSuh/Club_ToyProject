import { getParametersByPathSync } from 'aws-param-store';
const envData: { [key: string]: string } = {};
const path = '/sweetclub/env';
const region = 'ap-northeast-2';

const parameters = getParametersByPathSync(path, { region });

parameters.forEach((parameter) => {
  envData[parameter.Name.split('/')[3]] = parameter.Value;
});

export const configuration = () => envData;
