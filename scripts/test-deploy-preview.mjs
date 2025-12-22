#!/usr/bin/env node

/**
 * MCP Remote Verification Utility
 * 
 * Usage: node scripts/test-deploy-preview.mjs <preview-url>
 * Example: pnpm test:mcp-preview https://deploy-preview-123--asdlc.netlify.app
 */

import { argv } from 'process';

async function testRemoteProtocol(baseUrl) {
  const url = baseUrl.endsWith('/mcp') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/mcp`;
  
  console.log(`\n🚀 Testing MCP Server at: ${url}\n`);

  try {
    // 1. Test GET (SSE)
    console.log('--- Phase 1: SSE Initialization (GET) ---');
    const getRes = await fetch(url);
    if (!getRes.ok) {
        throw new Error(`GET failed: ${getRes.status} ${getRes.statusText}`);
    }
    const contentType = getRes.headers.get('content-type');
    if (!contentType?.includes('text/event-stream')) {
        throw new Error(`Invalid content-type: ${contentType}`);
    }
    console.log('✅ SSE endpoint ok (text/event-stream)');

    // 2. Test POST (JSON-RPC) - initialize
    console.log('\n--- Phase 2: JSON-RPC initialize (POST) ---');
    const initPayload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05' }
    };
    
    const initRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initPayload)
    });
    
    if (!initRes.ok) {
        throw new Error(`POST initialize failed: ${initRes.status}`);
    }
    
    const initData = await initRes.json();
    if (initData.result?.serverInfo?.name === 'asdlc-knowledge-base') {
        console.log(`✅ Server identified: ${initData.result.serverInfo.name} v${initData.result.serverInfo.version}`);
    } else {
        throw new Error(`Invalid initialize response: ${JSON.stringify(initData)}`);
    }

    // 3. Test POST (JSON-RPC) - tools/list
    console.log('\n--- Phase 3: JSON-RPC tools/list (POST) ---');
    const listPayload = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    };
    
    const listRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listPayload)
    });
    
    const listData = await listRes.json();
    if (listData.result?.tools?.length >= 3) {
        console.log(`✅ Tools found: ${listData.result.tools.map(t => t.name).join(', ')}`);
    } else {
        throw new Error(`Invalid tools/list response: ${JSON.stringify(listData)}`);
    }

    // 4. Test POST (JSON-RPC) - tools/call (list_articles)
    console.log('\n--- Phase 4: JSON-RPC tools/call list_articles (POST) ---');
    const callPayload = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'list_articles',
        arguments: {}
      }
    };
    
    const callRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callPayload)
    });
    
    const callData = await callRes.json();
    if (callData.result?.content?.[0]?.text) {
        console.log('✅ Articles retrieved successfully:');
        console.log('\n' + callData.result.content[0].text + '\n');
    } else {
        throw new Error(`Invalid tools/call list_articles response: ${JSON.stringify(callData)}`);
    }

    console.log('✨ All remote verification phases passed!\n');

  } catch (error) {
    console.error(`\n❌ Verification failed: ${error.message}\n`);
    process.exit(1);
  }
}

const targetUrl = argv[2];
if (!targetUrl) {
  console.error('Usage: pnpm test:mcp-preview <preview-url>');
  process.exit(1);
}

testRemoteProtocol(targetUrl);
