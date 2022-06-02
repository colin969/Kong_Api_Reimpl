
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testPathIgnorePatterns: [
        '<rootDir>/build/'
    ]
};

export default config;
