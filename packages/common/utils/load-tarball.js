'use strict'

const saveTarball = require('./save-tarball')
const CID = require('cids')
const loadManifest = require('../utils/load-manifest')

const readOrDownloadTarball = async (config, ipfs, path) => {
  const {
    packageName,
    packageVersion
  } = extractPackageDetails(path)

  let manifest = await loadManifest(config, ipfs, packageName)
  let version = manifest.versions[packageVersion]

  if (!version) {
    throw new Error(`Could not find version ${packageName}@${packageVersion} in available versions ${Object.keys(manifest.versions)}`)
  }

  if (!version.dist.cid) {
    return saveTarball(config, manifest.name, packageVersion, ipfs)
  }

  if (!version.dist.cid) {
    throw new Error(`CID for ${packageName}@${packageVersion} missing after download`)
  }

  return ipfs.catReadableStream(new CID(version.dist.cid))
}

const extractPackageDetails = (path) => {
  let [
    packageName, fileName
  ] = path.split('/-/')

  if (packageName.startsWith('/')) {
    packageName = packageName.substring(1)
  }

  let moduleName = packageName

  if (packageName.startsWith('@')) {
    moduleName = packageName.split('/').pop()
  }

  const packageVersion = fileName.substring(moduleName.length + 1, fileName.length - 4)

  return {
    packageName,
    packageVersion
  }
}

module.exports = readOrDownloadTarball
