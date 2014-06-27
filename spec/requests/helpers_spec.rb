require 'spec_helper'

describe 'integrated dough helper' do
  it 'can be called' do
    get "/integrated_dough_helper"
    expect(response.body).to include('hello world')
  end
end
