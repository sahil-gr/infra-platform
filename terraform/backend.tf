terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    region         = "ap-south-1"
    encrypt        = true
  }
}