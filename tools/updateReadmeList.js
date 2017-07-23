const fs = require('fs');
      path = require('path'),
      packager = require('./packager');

fs.readdir(packager.repositoriesPath, (e, repos) => {
    if(e)
        return packager.error('Cannot list folders in ' + repositoriesPath + ' :: ' + e);
    
    const readmePath = path.join(__dirname, '..', 'README.md');
    
    fs.readFile(readmePath, (e, content) => {
        if(e)
            throw e;
        
        content = content.toString();
        let leftSize = content.indexOf('Repository | - | -');
        leftSize = content.indexOf('-|-|-', leftSize) + 1;
        leftSize = content.indexOf('\r', leftSize) + 1;
        let rightSize = content.indexOf('\r\r', leftSize);
        if(rightSize === -1)
            rightSize = content.indexOf('\n\r\n', leftSize);
        if(rightSize === -1)
            throw new Error('Cannot parse the file README.md');
            
        const left = content.substring(0, leftSize);
        const right = content.substring(rightSize);
        
        content = left + repos
            .map((name) => {
                return name + ' | [:octocat:](https://github.com/OpenMarshal/octopod-repositories/tree/master/repositories/' + name + ') | [![npm Version](https://img.shields.io/npm/v/@octopod-service/' + name + '.svg)](https://www.npmjs.com/package/@octopod-service/' + name + ')'
            })
            .join('\n') + right;

        fs.writeFile(readmePath, content, (e) => {
            if(e)
                throw e;
            
            packager.success('README.md updated.');
        })
    })
})
