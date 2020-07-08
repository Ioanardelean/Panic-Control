import sonarqubeScanner from 'sonarqube-scanner';

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.sources': '.',
      'sonar.inclusions': 'src/**', // Entry point of your code
      'sonar.exclusions': '***/*.spec.ts',
    },
  },
  () => {}
);
