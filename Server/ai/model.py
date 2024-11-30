import torch
from PIL import Image
from diffusers import StableDiffusionPipeline

def sampling(prompts, batch_size=1):
    """
    주어진 프롬프트를 사용하여 이미지를 생성하는 함수.

    :param prompts: 이미지 생성을 위한 텍스트 프롬프트 목록
    :param batch_size: 한 번에 생성할 이미지 수
    :return: 생성된 이미지 목록 (PIL.Image 객체)
    """
    model_id = "runwayml/stable-diffusion-v1-5"  # 사용할 Stable Diffusion 모델 ID
    
    # Stable Diffusion 모델을 로드합니다.
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float32,
        low_cpu_mem_usage=True  # 메모리 사용을 최적화
    )  

    # Safety Checker 비활성화
    pipe.safety_checker = None


    # GPU가 사용 가능하면 GPU로 모델을 이동합니다.
    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
        print("cuda 사용")
    
    # 이미지를 생성합니다.
    images = pipe(prompt=prompts, num_inference_steps=3).images

    return images
