const path = require('path')

module.exports = class ReplicationRecipe {
  constructor(
    replicantName,
    templateName,
    templateDir,
    fileNameReplacements,
    sourceCodeReplacements,
    ignoreArtifacts,
    delimiters,
    customVariables
  ) {
    this.replicantName = replicantName
    this.templateName = templateName
    this.templateDir = templateDir
    this.fileNameReplacements = fileNameReplacements
    this.sourceCodeReplacements = sourceCodeReplacements
    this.ignoreArtifacts = ignoreArtifacts
    this.delimiters = delimiters
    this.customVariables = customVariables
  }

  static fromRecipeJson(data, replicantWorkDir) {
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, '_')
      .replace(/\..+/, '')
      .replace(/:/g, '-')
    const templateName =
      data.templateName || `${data.replicantName}_${timestamp}`

    const customVariables = [
      { 'name': 'name', 'value': data.replicantName }, // kept for retro-compatibility
      { 'name': 'replicantName', 'value': data.replicantName }
    ]
    if (data.customVariables) {
      for (let i = 0; i < data.customVariables.length; i++) {
        customVariables.push(data.customVariables[i])
      }
    }
    
    return new ReplicationRecipe(
      data.replicantName,
      templateName,
      path.join(replicantWorkDir, '_templates', templateName),
      data.fileNameReplacements,
      data.sourceCodeReplacements,
      data.ignoreArtifacts || [],
      data.customDelimiters || ['<<:', ':>>'],
      customVariables
    )
  }
}
