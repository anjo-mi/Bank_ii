### Table of Contents
- [Tech](#tech-stack)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Seeding](#seeding)
- [Performance](#performance)
- [Current Features](#current-features)
- [In the Works](#ensuing-updates)


## Current Status
- 🚫 In Production 🚫

## Overview
- Learning Platform for Studying Questions
- Store Questions with Associated Categories
- Guest features enabled
  - Generic Question Pool
    - Category Selection
    - Question and Answer Mode
- User-focused Searches for Questions by Category or ID
- User access and Session persistence
- Protected Routes ensuring authorization
- Rate Limiting for added Security

### Tech Stack
- Node.js, Express, MongoDB, EJS, Tailwind
- Testing:
   * Jest, Supertest, Playwright
- Performance:
   * Platformatic: Flame
- Authentication:
   * Passport.js

# Setup
- ```npm install```
- Create .env file in the root of project
   * ```
     PORT
     DB_PASSWORD (optional)
     DB_STR=mongodb+srv...mongodb.net/app?...
     DB_TEST_STR=mongodb+srv...mongodb.net/app-test?...
     ```
- ```npm run dev```
   * Via npm-run-all, Live CSS via Tailwind and Nodemon will run concurrently

## Running Tests
⚠️ Some tests require data in the database. If you need to populate your database, see [Seeding](#Seeding) ⚠️

- Only Jest Tests ran individually: `npm run test:reqs`
- Jest Testing:
   * npm run test
   * npm run test:auth
   * npm run test:models
   * npm run test:practo
   * npm run test:reqs
      - This requires changing the script between `/questionByCategory` and `/questionById`
- Playwright Tests are ran by Category
   * Authorization: `npm run test:pwauth`
   * Rate-Limiting: `npm run test:pwlimits`
   * Displays: `npm run test:displays`
   * Errors: `npm run test:errors`
   * Filtering Logic: `npm run test:filters`
   * Models: `npm run test:pwmodels`
   * Navigation: `npm run test:nav`
   * Setup: `npm run test:setup`
   * Routes: `npm run test:routes`
   * Practice: `npm run test:practice`
   * Playwright Requests: `npm run test:pwreqs`
 
## Seeding
- You may populate the database with functional generic data via the command `npm run seed`
   * It is recommended to load users via the endpoint rather than seeding, as seeding skips the user password encryption step.

## Performance
⚠️ Due to [configuration issues](#performance-configuration), this is a two step process! ⚠️
- Run: `npm run fire`
   * Flame Graphs will be generated as a .pb file and stored in node_modules/@platformatic/bin
- Run: `npm run fire:convert`
   * .pb files will be processed into .html files and placed in the root of the project with its accompanying .js file
- Open HTML File in Default Browser

<details markdown="1">

  <summary>Performance Configuration</summary>


###Performance Configuration

🤦 After installing all dependencies, the generated .pb files were getting caught in `/node_modules/@platformatic/flame/bin`

  - Fixing this involves going into `/node_modules/@platformatic/flame/bin` and altering flame.js to this:
  
```
#!/usr/bin/env node

const { parseArgs } = require('node:util')
const fs = require('fs')
const path = require('path')
const { startProfiling, generateFlamegraph } = require('../lib/index.js')

const { values: args, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    output: {
      type: 'string',
      short: 'o'
    },
    profile: {
      type: 'string',
      short: 'p'
    },
    help: {
      type: 'boolean',
      short: 'h'
    },
    version: {
      type: 'boolean',
      short: 'v'
    },
    manual: {
      type: 'boolean',
      short: 'm'
    }
  },
  allowPositionals: true
})

if (args.version) {
  const pkg = require('../package.json')
  console.log(pkg.version)
  process.exit(0)
}

if (args.help) {
  console.log(`
Usage: flame [options] <command>

Commands:
  run <script>           Run a script with profiling enabled
  generate <pprof-file>  Generate HTML flamegraph from pprof file

Options:
  -o, --output <file>    Output HTML file (for generate command)
  -p, --profile <file>   Profile file to use (for run command)
  -m, --manual          Manual profiling mode (require SIGUSR2 to start)
  -h, --help            Show this help message
  -v, --version         Show version number

Examples:
  flame run server.js              # Auto-start profiling
  flame run -m server.js           # Manual profiling (send SIGUSR2 to start)
  flame generate profile.pb.gz
  flame generate -o flamegraph.html profile.pb.gz
`)
  process.exit(0)
}

const command = positionals[0]

if (!command) {
  console.error('Error: No command specified. Use --help for usage information.')
  process.exit(1)
}

async function main () {
  try {
    switch (command) {
      case 'run': {
        const script = positionals[1]
        if (!script) {
          console.error('Error: No script specified for run command')
          process.exit(1)
        }

        if (!fs.existsSync(script)) {
          console.error(`Error: Script '${script}' not found`)
          process.exit(1)
        }

        const scriptArgs = positionals.slice(2)
        const autoStart = !args.manual
        const { pid, process: childProcess } = startProfiling(script, scriptArgs, { autoStart })

        console.log(`🔥 Started profiling process ${pid}`)
        if (autoStart) {
          console.log('🔥 CPU profiling is active and will generate profile on exit')
          console.log('🔥 Profile (.pb) and interactive HTML flamegraph will be auto-generated')
          console.log('🔥 Generated files will be saved in the current directory')
          console.log('Send SIGUSR2 to manually toggle profiling:')
        } else {
          console.log('📋 Manual profiling mode - send SIGUSR2 to start profiling:')
        }
        console.log(`  kill -USR2 ${pid}`)
        console.log('Press CTRL-C to stop profiling and exit')

        process.on('SIGINT', () => {
          console.log('\n🔥 Stopping flame profiler...')
          setTimeout(() => {
            childProcess.kill('SIGKILL')
            process.exit(0)
          }, 8000)
        })


        break
      }

      case 'generate': {
        const pprofFile = positionals[1]
        if (!pprofFile) {
          console.error('Error: No pprof file specified for generate command')
          process.exit(1)
        }

        if (!fs.existsSync(pprofFile)) {
          console.error(`Error: File '${pprofFile}' not found`)
          process.exit(1)
        }

        const outputFile = args.output || `${path.basename(pprofFile, path.extname(pprofFile))}.html`

        console.log(`Generating flamegraph from ${pprofFile}...`)
        const result = await generateFlamegraph(pprofFile, outputFile)
        console.log(`Flamegraph generated: ${outputFile}`)
        console.log(result.stdout)
        break
      }

      case 'toggle': {
        if (process.platform !== 'win32') {
          // Unix-like systems: Find running flame processes and send SIGUSR2
          const { spawn } = require('child_process')

          const ps = spawn('ps', ['aux'])
          let output = ''

          ps.stdout.on('data', (data) => {
            output += data.toString()
          })

          ps.on('close', (code) => {
            if (code !== 0) {
              console.error('Error: Could not list processes')
              process.exit(1)
            }

            const lines = output.split('\n')
            const flameProcesses = lines.filter(line =>
              line.includes('preload.js') || line.includes('flame run')
            )

            if (flameProcesses.length === 0) {
              console.error('No running flame processes found')
              process.exit(1)
            }

            flameProcesses.forEach(line => {
              const parts = line.trim().split(/\s+/)
              const pid = parts[1]
              if (pid && !isNaN(pid)) {
                console.log(`Toggling profiler for process ${pid}`)
                process.kill(parseInt(pid), 'SIGUSR2')
              }
            })
          })
        } else {
          // Windows: Use tasklist to find processes
          const { spawn } = require('child_process')

          const tasklist = spawn('tasklist', ['/fi', 'IMAGENAME eq node.exe', '/fo', 'csv'])
          let output = ''

          tasklist.stdout.on('data', (data) => {
            output += data.toString()
          })

          tasklist.on('close', (code) => {
            if (code !== 0) {
              console.error('Error: Could not list processes')
              process.exit(1)
            }

            const lines = output.split('\n')
            const processes = []

            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const parts = lines[i].split(',')
                if (parts.length >= 2) {
                  const pid = parts[1].replace(/"/g, '')
                  processes.push(pid)
                }
              }
            }

            if (processes.length === 0) {
              console.error('No running Node.js processes found')
              process.exit(1)
            }

            console.log('Windows detected: Direct signal toggle not supported.')
            console.log('Available Node.js processes:')
            processes.forEach(pid => {
              console.log(`  PID: ${pid}`)
            })
            console.log('Please use Ctrl-C or restart your flame application to toggle profiling.')
          })
        }
        break
      }

      default:
        console.error(`Error: Unknown command '${command}'. Use --help for usage information.`)
        process.exit(1)
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
```
  - And by going to `/node_modules/@platformatic/flame/preload.js` and updating the file to look like:
```
'use strict'

const fs = require('fs')
const path = require('path')
const pprof = require('@datadog/pprof')
const { spawn } = require('child_process')

const profiler = pprof.time
let isProfilerRunning = false
const autoStart = process.env.FLAME_AUTO_START === 'true'

function generateFlamegraph (pprofPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Find the flame CLI
    const flameBinPath = path.resolve(__dirname, 'bin', 'flame.js')
    const args = [flameBinPath, 'generate', '-o', outputPath, pprofPath]

    const child = spawn('node', args, { stdio: 'pipe' })
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(`Flamegraph generation failed: ${stderr || stdout}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

function stopProfilerQuick () {
  if (!isProfilerRunning) {
    return null
  }

  console.log('Stopping CPU profiler and writing profile to disk...')
  try {
    const profileData = profiler.stop()
    const profile = profileData.encode()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `cpu-profile-${timestamp}.pb`

    fs.writeFileSync(filename, profile)
    console.log(`🔥 CPU profile written to: ${filename}`)

    isProfilerRunning = false
    return filename
  } catch (error) {
    console.error('Error generating profile:', error)
    isProfilerRunning = false
    return null
  }
}

async function stopProfilerAndSave (generateHtml = false) {
  if (!isProfilerRunning) {
    return null
  }

  console.log('Stopping CPU profiler and writing profile to disk...')
  try {
    const profileData = profiler.stop()
    const profile = profileData.encode()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `cpu-profile-${timestamp}.pb`

    fs.writeFileSync(filename, profile)
    console.log(`🔥 CPU profile written to: ${filename}`)

    if (generateHtml) {
      // Auto-generate HTML flamegraph on exit
      const htmlFilename = filename.replace('.pb', '.html')
      console.log('🔥 Generating flamegraph...')
      try {
        await generateFlamegraph(filename, htmlFilename)
        console.log(`🔥 Flamegraph generated: ${htmlFilename}`)
        console.log(`🔥 Open file://${path.resolve(htmlFilename)} in your browser to view the flamegraph`)
      } catch (error) {
        console.error('Warning: Failed to generate flamegraph:', error.message)
      }
    }

    isProfilerRunning = false
    return filename
  } catch (error) {
    console.error('Error generating profile:', error)
    isProfilerRunning = false
    return null
  }
}

function generateHtmlAsync (filename) {
  const htmlFilename = filename.replace('.pb', '.html')
  console.log('🔥 Generating flamegraph...')
  console.log(`🔥 Flamegraph will be saved as: ${htmlFilename}`)
  console.log(`🔥 Open file://${path.resolve(htmlFilename)} in your browser once generation completes`)
  generateFlamegraph(filename, htmlFilename)
    .then(() => {
      console.log('🔥 Flamegraph generation completed')
    })
    .catch(error => {
      console.error('Warning: Failed to generate flamegraph:', error.message)
    })
}

function toggleProfiler () {
  if (!isProfilerRunning) {
    console.log('Starting CPU profiler...')
    profiler.start()
    isProfilerRunning = true
  } else {
    // Manual toggle - don't generate HTML
    stopProfilerAndSave(false)
  }
}

// Set up signal handling (SIGUSR2 on Unix-like systems)
if (process.platform !== 'win32') {
  process.on('SIGUSR2', toggleProfiler)
  console.log('Flame preload script loaded. Send SIGUSR2 to toggle profiling.')
} else {
  // On Windows, we use SIGINT (Ctrl-C) or set up alternative IPC
  console.log('Flame preload script loaded. Windows platform detected.')
  console.log('Use the CLI toggle command or send SIGINT to control profiling.')
}

console.log(`Process PID: ${process.pid}`)

// Auto-start profiling if enabled
if (autoStart) {
  console.log('🔥 Auto-starting CPU profiler...')
  toggleProfiler()

  let exitHandlerCalled = false

  // Auto-stop profiling when the process is about to exit
  process.on('beforeExit', async () => {
    if (isProfilerRunning && !exitHandlerCalled) {
      exitHandlerCalled = true
      console.log('🔥 Process exiting, stopping profiler...')
      await stopProfilerAndSave(true) // Generate HTML on exit
    }
  })

  // Handle explicit process.exit() calls
  const originalExit = process.exit
  process.exit = function (code) {
    if (isProfilerRunning && !exitHandlerCalled) {
      exitHandlerCalled = true
      console.log('🔥 Process exiting, stopping profiler...')
      // For process.exit(), we need to handle async differently since we can't await here
      stopProfilerAndSave(true).then(() => {
        return originalExit.call(this, code)
      }).catch(() => {
        return originalExit.call(this, code)
      })
      // Return without calling originalExit immediately - let the promise handle it
      return
    }
    return originalExit.call(this, code)
  }

  process.on('SIGINT', () => {
    if (isProfilerRunning && !exitHandlerCalled) {
      exitHandlerCalled = true
      console.log('\n🔥 SIGINT received, stopping profiler...')
      // For signals, do a quick synchronous save and show HTML info immediately
      const filename = stopProfilerQuick()
      if (filename) {
        generateHtmlAsync(filename)
      }
    }
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    if (isProfilerRunning && !exitHandlerCalled) {
      exitHandlerCalled = true
      console.log('\n🔥 SIGTERM received, stopping profiler...')
      // For signals, do a quick synchronous save and show HTML info immediately
      const filename = stopProfilerQuick()
      if (filename) {
        generateHtmlAsync(filename)
      }
    }
    process.exit(0)
  })
}

```
</details>

## Current Features
- Cross Device Styling and Functionality
- Database Connection and Model Logic
- Navigation
- Refined Search with keyword matching

## Ensuing Updates
- Users with personalized:
   * Questions, Categories
   * Answer Storage
   * Interview Mode
- Voice-to-Text
- AI Feedback and Follow-Up Questions


##### Expected Date MVP
- 9 Nov 2025
