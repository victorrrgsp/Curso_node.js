// aqui é onde vai ser criado a configuração do jest
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'


export default {
    // aqui são as exteções de aquivos q vai ser trabalhado aqui 
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/'
    }),
    // os tipos de arquivos testaveis, q é qualquer arquivo q termine com o sufixo .spec e .ts q sao teste unitarios, 
    // e os teste de integração vai ser .spec-int.ts
    testRegex: '.*\\.spec\\.ts',
    transform: {
        // aqui é para interpretar os arquivos typescript e javascript
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '.../coverage',
    testEnvironment: 'node'

}