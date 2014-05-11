<?php

class WorkoutControllerTest extends TestCase {

  /**
   * A basic functional test example.
   *
   * @return void
   */
  public function testIndexRoute()
  {
    $crawler = $this->client->request('GET', '/workout');

    $this->assertTrue($this->client->getResponse()->isOk());
  }

}