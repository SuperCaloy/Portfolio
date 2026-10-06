<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class KeepAliveTest extends TestCase
{
    public function test_keep_alive_endpoint_aborts_403_when_token_is_missing_or_invalid(): void
    {
        Config::set('app.keep_alive_token', 'secret-keep-alive-token');

        $responseNoToken = $this->get('/system/keep-alive');
        $responseNoToken->assertStatus(403);

        $responseWrongToken = $this->get('/system/keep-alive?token=wrong-token');
        $responseWrongToken->assertStatus(403);
    }

    public function test_keep_alive_endpoint_returns_200_ok_when_token_is_valid(): void
    {
        Config::set('app.keep_alive_token', 'secret-keep-alive-token');

        $response = $this->get('/system/keep-alive?token=secret-keep-alive-token');
        $response->assertStatus(200);
        $this->assertSame('OK', $response->getContent());
    }
}
