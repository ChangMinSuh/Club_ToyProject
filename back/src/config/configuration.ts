import { getParametersByPathSync } from 'aws-param-store';

export const configuration = async () => {
  const envData: { [key: string]: string } = {};
  const path = '/sweetclub/env';
  const parameters = getParametersByPathSync(path);

  parameters.forEach((parameter) => {
    envData[parameter.Name] = parameter.Value;
  });

  return envData;
};
