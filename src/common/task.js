import spinner from './spinner'

export default async (text, promise) => {
  spinner.start(text);
  await promise()
  spinner.succeed()
}
