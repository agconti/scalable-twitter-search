import { rebuildIndexServer } from '../index-builder'
const [serverId] = process.argv.slice(2)

const main = async () => {
  console.log(`Rebuilding server ${serverId}`)
  await rebuildIndexServer(serverId)
  console.log(`Finished rebuilding server ${serverId}`)
  process.exit(0)
}

main()
